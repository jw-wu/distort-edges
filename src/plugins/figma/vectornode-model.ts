/* System */
import * as consoleTheme from "../../library/console-theme";



// A blueprint for manipulating Vector Nodes.
export class VectorNodeModel {

  protected commands: VectorPathCommand[];
  protected nsew: [ number, number, number, number ];


  constructor(d: string) {
  
    this.commands = [ ];
    this.nsew = [ 0, 0, 0, 0 ];


    // Sets up variables for calculating winding.
    // https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
    const windingCalculation: WindingData = {
      firstCoords: { x: 0, y: 0 },
      previousCoords: { x: 0, y: 0 },
      currentCoords: { x: 0, y: 0 },
      area: 0,
      vectorCommands: [ ]
    };


    // Split entry into an array of entries e.g. [ M, 30, 42, L ... ].
    let entries = d.split(" ");
    

    // Goes through each array element and determine if it is a direction or a coordinate, and act accordingly.
    for (let entry of entries) {

      // Creates a "blank" VectorPathCommand for entry and winding calculations.
      if (isVectorPathCommandDirection(entry)) {

        let newVectorCommand: VectorPathCommand = {
          type: entry,
          handles: [ ],
          coords: { x: NaN, y: NaN },
          origin: { x: NaN, y: NaN },
          winding: "clockwise"
        };

        this.commands.push(newVectorCommand);

        if (entry !== "Z") {

          windingCalculation.vectorCommands.push(newVectorCommand);
          windingCalculation.previousCoords = { ...windingCalculation.currentCoords };

        }

        else {

          windingCalculation.area += this._getWindingArea(windingCalculation.currentCoords, windingCalculation.firstCoords);

          const windingDirection = (windingCalculation.area > 0) ? "counter-clockwise" : "clockwise";

          for (let i = 0; i < windingCalculation.vectorCommands.length; ++i) {

            let vectorCommand = windingCalculation.vectorCommands[i];
            vectorCommand.winding = windingDirection;

          }

        }

      }
      
      else {

        const vectorCommand = this.commands[this.commands.length - 1],
              coord = Number(entry);

        switch(vectorCommand.type) {

          case "M":
          case "L":

            // X coordinates always comes first in a valid input.
            if (isNaN(vectorCommand.coords.x)) {

              vectorCommand.coords.x = coord;
              this._setEW(coord);

              if (vectorCommand.type === "M")
                windingCalculation.firstCoords.x = coord;

              windingCalculation.currentCoords.x = coord;


            }

            else {

              vectorCommand.coords.y = coord;

              const previousCommand = this.getPreviousCommand(vectorCommand) ?? { coords: { x: 0, y: 0 } };
              vectorCommand.origin = (vectorCommand.type === "M") ? vectorCommand.coords : previousCommand.coords;

              this._setNS(coord);

              if (vectorCommand.type === "M")
                windingCalculation.firstCoords.y = coord;

              windingCalculation.currentCoords.y = coord;
              
              if (vectorCommand.type !== "M")
                windingCalculation.area += this._getWindingArea(windingCalculation.previousCoords, windingCalculation.currentCoords);

            }

            break;


          case "C":

            // First handle end point coords.
            if (vectorCommand.handles.length === 0)
              vectorCommand.handles.push({ x: coord, y: NaN });

            else if (vectorCommand.handles.length === 1 && isNaN(vectorCommand.handles[0].y))
              vectorCommand.handles[0].y = coord;

            // Second handle end point coords.
            else if (vectorCommand.handles.length === 1)
              vectorCommand.handles.push({ x: coord, y: NaN });

            else if (vectorCommand.handles.length === 2 && isNaN(vectorCommand.handles[1].y))
              vectorCommand.handles[1].y = coord;

            // X and y coords.
            else if (isNaN(vectorCommand.coords.x)) {

              vectorCommand.coords.x = coord;

              this._setEW(coord);

              windingCalculation.currentCoords.x = coord;

            }

            else {

              vectorCommand.coords.y = coord;
              
              const previousCommand = this.getPreviousCommand(vectorCommand) ?? { coords: { x: 0, y: 0 } };
              vectorCommand.origin = previousCommand.coords;

              this._setNS(coord);

              windingCalculation.currentCoords.y = coord;
              windingCalculation.area += this._getWindingArea(windingCalculation.previousCoords, windingCalculation.currentCoords);

            }
            
            break;


          case "Q":

            if (vectorCommand.handles.length === 0)
              vectorCommand.handles.push({ x: coord, y: NaN });

            else if (vectorCommand.handles.length === 1)
              vectorCommand.handles[0].y = coord;

            else if (isNaN(vectorCommand.coords.x)) {

              vectorCommand.coords.x = coord;
              
              this._setEW(coord);

              windingCalculation.currentCoords.x = coord;

            }

            else {

              vectorCommand.coords.y = coord;

              const previousCommand = this.getPreviousCommand(vectorCommand) ?? { coords: { x: 0, y: 0 } };
              vectorCommand.origin = previousCommand.coords;

              this._setNS(coord);

              windingCalculation.currentCoords.y = coord;
              windingCalculation.area += this._getWindingArea(windingCalculation.previousCoords, windingCalculation.currentCoords);
              
            }

            break;


          // Do we need this?
          case "Z":           

            const previousCommand = this.getPreviousCommand(vectorCommand);

            if (previousCommand && previousCommand.coords !== this.getCommand(0).coords) {

              let start = this.getCommand(0);
              this.commands.push({
                type: "L",
                handles: [ ],
                coords: { x: start.coords.x, y: start.coords.y },
                origin: previousCommand.coords,
                winding: (windingCalculation.area > 0) ? "counter-clockwise" : "clockwise"
              });

            }
            
            break;

        }
      }
    }

  }


  // Calculate bounding box of the whole vector.
  private _setNS(coord: number): void {

    if (coord < this.nsew[0])
      this.nsew[0] = coord;

    else if (coord > this.nsew[1])
      this.nsew[1] = coord;

  }


  private _setEW(coord: number): void {

    if (coord < this.nsew[3])
      this.nsew[3] = coord;

    else if (coord > this.nsew[2])
      this.nsew[2] = coord;

  }


  private _getWindingArea(previousCoords: Vector, currentCoords: Vector): number {

    return (currentCoords.x - previousCoords.x) * (currentCoords.y + currentCoords.y);

  }
  

  // General.

  size(): number {

    return this.commands.length;

  }


  // Command actions.

  getCommandIndex(vectorCommand: VectorPathCommand): number {

    return this.commands.indexOf(vectorCommand);

  }


  getCommand(index: number): VectorPathCommand {
    
    return this.commands[index];

  }


  getFirstCommandOnPath(vectorCommand: VectorPathCommand, allowM?: boolean): VectorPathCommand {

    allowM = allowM ?? true;

    const currentVectorCommandIndex = this.getCommandIndex(vectorCommand);
    let firstVectorCommand: VectorPathCommand = vectorCommand;

    if (currentVectorCommandIndex > 0) {

      for (let i = currentVectorCommandIndex - 1; i >= 0; --i) {

        if (i === 0)
          firstVectorCommand = this.getCommand(0);
        
        else if (this.getCommand(i).type === "Z") {

          let firstVectorCommandIndex = i + 1;

          if (allowM)
            firstVectorCommand = this.getCommand(firstVectorCommandIndex);

          else {

            while (this.getCommand(firstVectorCommandIndex).type === "M") {
              ++firstVectorCommandIndex;
            }

            firstVectorCommand = this.getCommand(firstVectorCommandIndex);

          }
        
          break;          

        }

      }

    }

    else if (currentVectorCommandIndex === 0)
      firstVectorCommand = vectorCommand;

    else
      console.error("Vector command not found in model.");
    
    return firstVectorCommand;

  }


  getLastCommandOnPath(vectorCommand: VectorPathCommand, allowZ?: boolean): VectorPathCommand {

    allowZ = allowZ ?? true;

    const librarySize = this.size(),
          currentVectorCommandIndex = this.getCommandIndex(vectorCommand);

    let lastVectorCommand = vectorCommand;

    if (currentVectorCommandIndex >= 0) {

      for (let i = currentVectorCommandIndex; i < librarySize; ++i) {

        lastVectorCommand = this.getCommand(i);
        
        if (this.getCommand(i).type === "Z") {

          if (!allowZ)
            lastVectorCommand = this.getCommand(i - 1);

          break;

        }

      }
    
    }

    else
      console.error("Vector command not found in model.");
    
    return lastVectorCommand;

  }


  getPreviousCommand(vectorCommand: VectorPathCommand): VectorPathCommand | null {

    const i = this.commands.indexOf(vectorCommand);

    if (i === 0) {

      console.log(`%cLast command in library retrieved as current command is the first.`, consoleTheme.secondary);
      return this.commands[this.commands.length - 1];;
      
    }

    else if (i > 0) {
      
      return this.commands[i - 1];

    }

    else {

      console.log(`%cNo such command found. Command requested: ${JSON.stringify(vectorCommand)}`, consoleTheme.error);
      return null;

    }
  }


  getNextCommand(vectorCommand: VectorPathCommand): VectorPathCommand | null {

    const i = this.commands.indexOf(vectorCommand);

    if (i === this.size() - 1) {

      console.log(`%cFirst command of library retrieved as current command is the last.`, consoleTheme.secondary);
      return this.commands[0];

    }

    else if (i > -1) {

      return this.commands[i + 1];

    }

    else {

      console.log(`%cNo such command found. Command requested: ${JSON.stringify(vectorCommand)}`, consoleTheme.error);
      return null;
    }

  }


  saveCoords(vectorCommand: VectorPathCommand, coords: { x: number, y: number }): void {
  
    const vectorCommandIndex = this.getCommandIndex(vectorCommand),
          vectorCommandProperties = this.getCommand(vectorCommandIndex);

    vectorCommandProperties.coords = { x: coords.x, y: coords.y };

  }


  saveHandle(vectorCommand: VectorPathCommand, handles: { x: number, y: number }[]): void {

    const vectorCommandIndex = this.getCommandIndex(vectorCommand),
          vectorCommandProperties = this.getCommand(vectorCommandIndex);

    vectorCommandProperties.handles = handles;

  }


  getBoundingBox(): { width: number, height: number } {

    return { width: this.nsew[2] - this.nsew[3], height: this.nsew[1] - this.nsew[0] };

  }
  
}



export interface VectorPathCommand {
  type: VectorPathCommandDirection;
  coords: { x: number; y: number; };
  origin: { x: number; y: number; };
  handles: { x: number; y: number; }[];
  winding: "clockwise" | "counter-clockwise";
}


interface WindingData {
  firstCoords:  { x: number, y: number };
  previousCoords: { x: number, y: number };
  currentCoords: { x: number, y: number };
  area: number;
  vectorCommands: VectorPathCommand[];
}


type VectorPathCommandDirection = "M" | "L" | "C" | "Q" | "Z";
function isVectorPathCommandDirection(input: string): input is VectorPathCommandDirection {
  return /[MLQCZ]/i.test(input);
}
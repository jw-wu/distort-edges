Script is exported as a UMD module with Webpack 5.

1. Import via ```import DistortedShape from "path/to/script"```, or as an ESM with ```import "path/to/script"```.
2. Create a new DistortedShape class ```let distortion = new DistortedShape(path, settings)```;
3. Call the available methods ```distortion.getDrawCommands(recipe)``` or ```distortion.getAll(recipe)```;

The following alternative is possible as well:
```let distortion = new DistortedShape(path, settings, recipe)```
```distortion.getDrawCommands()```


**Parameters**

```path: string```
The SVG code or the ```d``` value in an SVG.

```settings: object```
| Property                | Type      | Description                                                                                         |
| :---                    | :---      | :---                                                                                                |
| variableDistanceApart   | boolean   | Should the apexes be a randomly distanced from each other?                                          |
| distanceApart           | number    | Distance between each sub-segment apex. Not needed if variableDistanceApart is set to ```true```.   |
| minDistanceApart        | number    | Minimum distance between each apex. Not needed if variableDistanceApart is set to ```false```.      |
| maxDistanceApart        | number    | Maximum distance between each apex. Not needed if variableDistanceApart is set to ```false```.      |
| keepWithinOriginalSize  | boolean   | Should the shape extend beyond its original boundaries.                                             |

```recipe: object```
| Property                    | Type                | Description                                                     |
| :---                        | :---                | :---                                                            |
| variableDistortionDistance  | boolean             | Should the apexes be a randomly offset from the center?         |
| maximumDistortionDistance   | number              | Maximum distance each apex will go.                             |
| handleDistancePeak          | number              | How round should the peak of the apexes be?                     |
| handleDistanceTrough        | number              | How round should the troughs of the apexes be?                  |
| forceDistortion             | boolean | undefined | Should the sub-segments be distorted even if they are small?    |


**Methods**

| Method                    | Return type                                         | Description                                                                   |
| :---                      | :---                                                | :---                                                                          |
| getDrawCommands           | string                                              | Returns the svg ```d``` path.                                                 |
| getAll                    | { path: string, center: { x: number, y: number } }  | Returns the svg ```d``` path and the coordinates of the shape's center point. |
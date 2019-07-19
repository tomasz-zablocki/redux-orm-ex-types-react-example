# Redux-ORM typescript example: create-react-app + experimental types

Integrating experimental `redux-orm` typings with `create-react-app@^3.0.0`

## How-to

* `npm install` 
* `npm start`

## Notes

### Adding experimental `redux-orm` types dependency 

__warning: these are WIP types, rough packaging ahead__
 
1. adding experimental types to **package.json**:
    ```json5
    {
     //...
     "devDependencies": {
        //... 
        "redux-orm-typings": "tomasz-zablocki/redux-orm-typings#experimental",
      }
     }
    ```
2. create complementary **tsconfig** file, for example **tsconfig.paths.json**
3. reference `redux-orm-typings` by setting `baseUrl` and `paths` in the complementary **tsconfig** file:
      ```json
      {
        "compilerOptions": {
          "baseUrl": ".",
          "paths": {
            "*": [
              "node_modules/@types/*"
            ],
            "redux-orm": [
              "node_modules/redux-orm-typings/types/redux-orm"
            ]
          }
        }
      }
      ```
4. reference complementary **tsconfig** file as an extension base for **tsconfig.json**
   ```json5
   {
     "extends": "./tsconfig.paths.json",
     //...
   }
   ```

This prevents `react-scripts` from modifying **tsconfig.json**, despite `npm start` log message:
```
The following changes are being made to your tsconfig.json file:
  - compilerOptions.paths must not be set (aliased imports are not supported)
Starting the development server...
```
the extended **tsconfig** file remains unchanged. 

### Redux-ORM schema definition

**Do not declare instance properties inside class definitions - babel transpiles them into additional prototype properties which interfere with `redux-orm` descriptors.**  

#### Declaration merging

1. each `Model` is defined by a class and an interface with matching identifiers
2. define an interface describing the shape of `Model`'s instances:
    ```typescript
    interface SourceModel {
        id: number
        name: string
        target: TargetModel
    }
 
    interface TargetModel {
        id: number
        sources: QuerySet<SourceModel>
    }
    ```
3. define related `Model` class extending `Model` providing additional type parameter. 
    <br>Set the parameter to `typeof (TheModelBeingDefined)`
    ```typescript
    class SourceModel extends Model<typeof SourceModel> {
        static modelName = 'SourceModel' as const
    
        static fields = {
            id: attr(),
            name: attr(),
            target: fk('TargetModel', 'sources')
        }
    }
 
    class TargetModel extends Model<typeof TargetModel> {
        static modelName = 'TargetModel' as const
    
        static fields = {
            id: attr()
        }
    }
    ```
   
### Mapping `Model.fields` to `Model` interfaces  

Assuming two related `Model` classes: `SourceModel` and `TargetModel`
    
| `SourceModel.fields` | `interface SourceModel` | `interface TargetModel` |
| --- | --- | --- | 
| `attr()` | `string`, `number`, `boolean`, plain objects, arrays of primitives/plain objects |  |  
| `fk('TargetModel')` | `TargetModel` | `QuerySet<SourceModel>`|
| `oneToOne('TargetModel')` | `TargetModel` |`SourceModel`|
| `many('TargetModel')` |`MutableQuerySet<TargetModel>` | `MutableQuerySet<SourceModel>`| 

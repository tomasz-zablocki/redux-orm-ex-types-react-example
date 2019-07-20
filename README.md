# Redux-ORM typescript example: create-react-app + experimental types

Integrating experimental `redux-orm` typings with `create-react-app@^3.0.0`

## How-to

* `npm install` 
* `npm start`

## Notes

__warning: these types are a WIP - likely to change in future__

### Installing 

Substitute `@types/redux-orm` dependency with experimental redux-orm types branch:

```json5
{
 //...
 "dependencies": {
    //... 
    "@types/redux-orm": "github:tomasz-zablocki/redux-orm-typings#experimental"
  }
 }
```

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

### Todo List Exercise: React-Redux Training

This is a modification of the [Intro to Redux: Basic Tutorial](https://redux.js.org/basics/example) that I followed on the [Redux.js](https://redux.js.org) website.

### Notes on the sample:

I struggled with this. Okay, I get complex and dynamic Single Page Apps (SPAs) need to manage state in one central location. Even powerful Web Component Frameworks like React get complex when you are passing state up and down the Component tree. 

Redux provides some conventions on how to manage state, state containers, etc. This makes sense.

But I really struggled to follow how this example was changing state. Especially the magic looking bits where Components are hooked into. Even after I went back and brushed up on ES6, still was hard for me to wrap my head around.

Also the seperation of containers (functionality) and components (visual layout).

### What I did:

I added a SummaryCount component to the example.
1) created new Component's HTML layout in ["SummaryCount"](./src/components/SummaryCount.js).
2) Established new Component's functionality in ["GetSummaryCount"](./src/containers/GetSummaryCount.js). Here the new Component is given Redux superpowers with:
		```
		export default connect(
		  mapStateToProps,
		  null // switched to null
		)(SummaryCount)
		```
Which wraps it. The mapStateToProps is a function to control how it gets Redux's state container info. This sets up an event listener. When the Redux state changes this gets called. This handles checking the new state and passing relevent info along to the container as properties. It will also cause the component to re-render if there's any changes to properties?

There is usually(?) a second argument to connect() called by convention, ["mapDispatchToProps"](https://react-redux.js.org/api/connect#mapdispatchtoprops-object-dispatch-ownprops-object). I think this would be better called "DispatchFromProps" because, from what I understand, it is a way to have your component say, "hey Redux state container, I changed in some way. Go update yourself so other web components know, and can respond accordingly." Basically you map out what Action you want associated with each property change. 

```
	function(mapStateToProps, mapDispatchToProps) {
		return function(YourComponent)
	}
```

That gets hooked into your app via the connect function.
```
connect(mapStateToProps, mapDispatchToProps)(YourComponent)
```
The connect() function here is a [higher order function](https://en.wikipedia.org/wiki/Higher-order_function) that wraps your component. Note to self:  it's read as:
```
var createdFunction = connect(params);
createdFunction(YourComponent)
```

Needed to look that one up.  

3) Updated Reducer action's, ['ADD_TODO' and 'TOGGLE_TODO'](https://github.com/ryansutc/react_tests/blob/5f8062c5669071ff34a5b5e463b0e12c71945f96/mytodo/src/reducers/todos.js#L6-L35) to handle updating the new store object properties I created for the summary component. This part could probably be heavily refactored. I avoided mutating the existing state by using [```JSON.parse(JSON.stringify([origObject]))```](https://github.com/ryansutc/react_tests/blob/5f8062c5669071ff34a5b5e463b0e12c71945f96/mytodo/src/reducers/todos.js#L13) which is a bit of a hack to make a deep copy of an object.










### Tic Tac Toe Tutorial Exercise

This is a modification of the [Intro to React Tic Tac Toe tutorial](https://reactjs.org/tutorial/tutorial.html)


### Notes on this sample

I did some "challenges" beyond the tutorial to see if I could do it on my own.

- **Expose col and row in move history**. In order to expose the col, row of the square clicked I changed the parameters of the ```Game``` component's ```handleClick``` method to include col and row arguments. See line 91. ```className``` attributes with the coordinates to the Square components. I saved these arguments in the Game component's state so that the Game always stores the currently clicked cell. See line 110-111.
When I render or re-render the Game (& child components), the ```render``` method displays these coordinates in the history button by referencing them w. ```this.state.col```.

- **Highlight currently selected item on board**. In order to highlight the currently selected item I created a component state attribute called ```curClick```. See line 87. The handle method/function that gets passed down to the Square component-- in the child Board component a boolean property called ```isCurClick``` is created and passed to the Square component. This checks if the index of the square matches that of the game. Each time a click happens the squares are re-rendered and the currently clicked square is rechecked.  
The Square component renders itself according to conditional logic: if it is the currently selected the ```className``` attribute is updated to include red. [todo: there probably could be some better refactoring of this. Struggling a bit with getting conditionals into jsx...]. The ```className``` parameter is how you set the html class attribute via React.

- **If someone wins, highlight winning cells. If no-one wins, say match was a draw**. In order to accomplish this I updated the helper method calculateWinner to return the winning square index numbers. I tried to update state inside of the Game's ```handleClick``` method. But that didn't work because the render() method hadn't run and handleClick didn't have the latest, greatest state. Had to update state in render.

Also ran into gotcha of: 
	``` i in array ``` <> ```array.includes(i)```
Latter is good. Former is bad, bad, bad.


### Summary:

Basic steps for all of these enhancements:

1) Create or update a method to capture this information.
2) Save the properties or values to the parent components state object.
3) Pass the properties down to the child component by including in the render jsx. So if the render generates a child <Square> element. Within that element inject the paramenter/argument?
4) Invoke the passed parameter in the child class as part of ```this.props.[yerval]```



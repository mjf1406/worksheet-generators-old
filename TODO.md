# Monkey Teacher's Worksheet Generators

## Change Log
- 2023/12/xx
    - [ ] Hint Pages
        - that reveals Sections and teaches students how to make the sections themselves
            - (?) a step-by-step guide for each arithmetic operation
            - (?) a step-by-step guide with no arithmetic required
        - that reveals Directions
        - that reveals Sections and Directions
    - [ ] Answer Page
    - [ ] Fixed: US Letter now has properly scaled PDF output. Before it was too small.
    - [ ] Fixed: Section numbers now are properly displayed in the output PDF.
    - [ ] Fixed: made Light Theme colors better, less 'jarring'/contrasting
- 2023/12/17
    - Fixed: Letter Case now updates the Word Search and Word Bank.
    - Fixed: Reveal Sections no longer removes the Directions in the Word Bank.
    - Reduced the opacity of the section labels
- 2023/12/16
    - implemented debouncing on increment buttons, decrement buttons, and the words input
    - make the sections pretty
    - changed section numbers to be relative to height of the word search
    - Sections breaks down when column and row are not the same
    - the section number now displays in the word search if revealSections is checked, word bank is updated, too
    - each word's section is not determined in `determineWordSections()` and properly displayed in the word bank based on revealSections
    - Larger buttons were added to increment and decrement Rows and Columns
    - words that were not placed are now tracked and the user is alerted to those words via a toast
    - word bank height automatically adjusts based on remaining space on sheet now
    - word search is now redrawn on Letter Case change and reveal Section change
    - Work bank is now redrawn on reveal Section change, reveal Direction change, and Letter Case change
    - the title is now redrawn on user input
    - added warning icons to Rows, Columns, and Word Direction to inform the user that a new word search must be generated for these changes to take effect
- 2023/12/15
    - Rows and Columns now are updated to the longest word's length if they are less than the longest word's length
    - Basic implementation of sections complete
    - Removed 12 sections as it was all kinds of broken
- 2023/12/14
    - Prevented default on form action when `All` button is clicked.
    - Changed sections from number input to radiogroup: 4, 9, 12, 16. 
- 2023/12/12
    - Added select all and deselect all button for Word Directions
    - Added Word Stats
    - Disabled Print button, will figure out later
    - Set scale of preview to 70% and got it downloading correctly

## Generators

### Word Search
- Test
    - muntjac, kangaroo, hippopotamus, tenrec, monkey, elk, giraffe, hummingbird, mouse, rat, bat, flamingo, beaver, blackbuck, boar, bear, snake, spider, grasshopper, mantis
- Inputs
    - (?) Copies -- Should this be added so it can be printed in one fell swoop?

### Crossword Puzzle
- Test
tiger an animal that has stripes, and is orange
lion an animal with a large main, and live in Africa
monkey Mr. Michael is really this and not human
cool of or at a fairly low temperature
hot having a high degree of heat or a high temperature
spicy flavored with or fragrant with spice.
asteroid a small rocky body orbiting the sun. Large numbers of these, ranging enormously in size, are found between the orbits of Mars and Jupiter, though some have more eccentric orbits.
comet a celestial object consisting of a nucleus of ice and dust and, when near the sun, a ‘tail’ of gas and dust particles pointing away from the sun.

### Osmo Bit Maze
- Generation
    - Eller's algo
    - Recursive Backtracking
    - Prim's algo
    - Kruskal's algo
- Inputs
    - Number of commands required to finish the maze
        - Minimum: ???
        - Maximum: ???
    - Difficulty 
        - proxy for how long the black line is that bit follows
        - determines which command codes are required to finish the maze
    - Generate two? (Front and back of page)
    - Generate larger mazes? (tape multiple pages together)
    - Grid type
        - square
        - circle
        - hex
- Output
    - How wide is the Bit black line?
    - Option to reveal the required commands with or without the quantities

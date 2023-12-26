# Monkey Teacher's Worksheet Generators

## Change Log
- 2023/12/xx
    - [ ] (Word Search) Hint Pages
        - (Word Search) that reveals Sections and teaches students how to make the sections themselves
            - (Word Search) (?) a step-by-step guide for each arithmetic operation
            - (Word Search) (?) a step-by-step guide with no arithmetic required
        - (Word Search) that reveals Directions
        - (Word Search) that reveals Sections and Directions
    - [ ] (Word Search) Answer Page
    - [ ] (Word Search) Fixed: US Letter now has properly scaled PDF output. Before it was too small.
    - [ ] (Word Search) Fixed: Section numbers now are properly displayed in the output PDF.
    - [ ] (Word Search) Fixed: made Light Theme colors better, less 'jarring'/contrasting
- 2023/12/26
    - [ ] added `<script>` tags to all the new HTML files to ensure they load the proper JS files
    - reorganized the file structure, now each generator is its own page
    - crossword is not dismayed correctly in the preview so that I can visualize the output of the algo
    - `updatePreview()` now works for both crosswords and word searches
    - started organizing Ozobot Maze inputs
- 2023/12/17
    - (Word Search) Fixed: Letter Case now updates the Word Search and Word Bank.
    - (Word Search) Fixed: Reveal Sections no longer removes the Directions in the Word Bank.
    - (Word Search) Reduced the opacity of the section labels
- 2023/12/16
    - (Word Search) implemented debouncing on increment buttons, decrement buttons, and the words input
    - (Word Search) make the sections pretty
    - (Word Search) changed section numbers to be relative to height of the word search
    - (Word Search) Sections breaks down when column and row are not the same
    - (Word Search) the section number now displays in the word search if revealSections is checked, word bank is updated, too
    - (Word Search) each word's section is not determined in `determineWordSections()` and properly displayed in the word bank based on revealSections
    - (Word Search) Larger buttons were added to increment and decrement Rows and Columns
    - (Word Search) words that were not placed are now tracked and the user is alerted to those words via a toast
    - (Word Search) word bank height automatically adjusts based on remaining space on sheet now
    - (Word Search) word search is now redrawn on Letter Case change and reveal Section change
    - (Word Search) Work bank is now redrawn on reveal Section change, reveal Direction change, and Letter Case change
    - (Word Search) the title is now redrawn on user input
    - (Word Search) added warning icons to Rows, Columns, and Word Direction to inform the user that a new word search must be generated for these changes to take effect
- 2023/12/15
    - (Word Search) Rows and Columns now are updated to the longest word's length if they are less than the longest word's length
    - (Word Search) Basic implementation of sections complete
    - (Word Search) Removed 12 sections as it was all kinds of broken
- 2023/12/14
    - (Word Search) Prevented default on form action when `All` button is clicked.
    - (Word Search) Changed sections from number input to radiogroup: 4, 9, 12, 16. 
- 2023/12/12
    - (Word Search) Added select all and deselect all button for Word Directions
    - (Word Search) Added Word Stats
    - (Word Search) Disabled Print button, will figure out later
    - (Word Search) Set scale of preview to 70% and got it downloading correctly

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

### Osmo Ozobot Maze
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

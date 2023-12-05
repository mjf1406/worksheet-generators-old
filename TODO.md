# Monkey Teacher's Worksheet Generators

## Generators

### Word Search
- Inputs
    - (?) Copies -- Should this be added so it can be printed in one fell swoop?
    - Word Direction
        - Needs a select all
        - (?) Double click one to select all
        - (?) Right click to select one
    - Words
        - Add longest word and number of characters
            - automatically adjust rows and columns based on this
        - Average length
        - number of words
    - Sections
        - Update preview on change
    - Reveal Sections  
        - Update preview on toggle
    - Reveal Direction
        - Update preview on toggle
    - Letter Case
        - Update preview on change
- Algo
    - Sections
- Output, Worksheet
    - [x] Name input for student
    - [ ] Date -- Need to make it auto-update
    - [x] Word Search
    - [x] Word Bank
- Output, Answer Key
    - Name
    - Date
    - Word Search
    - Word Bank
    - Need to change the way the answers are revealed, colors are ugly
- Test
    - muntjac, kangaroo, hippopotamus, tenrec, monkey, elk, giraffe, hummingbird, mouse, rat, bat, flamingo, beaver, blackbuck, boar, bear, snake, spider, grasshoper, mantis

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

/* eslint-env jasmine */
const { default: Engine } = require('../src/engine')
const { default: Parser } = require('../src/parser/parser')

const HORIZONTAL_GAME = `title check that Horizontal Expands

========
OBJECTS
========

Background
blue

Player
green

Sand
yellow

Water
Blue

=======
LEGEND
=======

. = Background

================
COLLISIONLAYERS
================

Background
Player
Sand
Water

======
RULES
======

LEFT [ HORIZONTAL Player > Water ] -> [ UP Sand ]

=======
LEVELS
=======

.


` // end game

function parseEngine (code) {
  const { data, error } = Parser.parse(code)
  expect(error && error.message).toBeFalsy() // Use && so the error messages are shorter

  const engine = new Engine(data)
  engine.setLevel(0)
  return { engine, data }
}

describe.only('Rule simplifier', () => {
  it.only('expands horizontal rules', () => {
    const {engine, data} = parseEngine(HORIZONTAL_GAME)
    const foo = data.rules
    debugger
    console.log('Rules created:', foo.length)
    expect(foo.length).toBe(2)
  })
})
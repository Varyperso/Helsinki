// const { test, describe } = require('node:test')
// const assert = require('node:assert')
// const listHelper = require('../utils/list_helper')
// const { listWithOneBlog, listWithManyBlogs } = require('./tests_helper')

// test('dummy returns one', () => {
//   assert.strictEqual(listHelper.dummy([]), 1)
// })

// describe('total likes', () => {
//   test('when list has only one blog, equals the likes of that', () => {
//     assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
//   })

//   test('when has many blogs', () => {
//     assert.strictEqual(listHelper.totalLikes(listWithManyBlogs), 36)
//   })

//   test('when empty array', () => {
//     assert.strictEqual(listHelper.totalLikes([]), 0)
//   })
// })

// describe('favorite blog', () => {
//   test('when list is empty', () => {
//     assert.strictEqual(listHelper.favoriteBlog([]), null)
//   })
  
//   test('when list has only one blog', () => {
//     assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
//   })

//   test('when list has many blogs', () => {
//     assert.deepStrictEqual(listHelper.favoriteBlog(listWithManyBlogs), listWithManyBlogs[2])
//   })
// })

// describe('most blogs', () => {
//   test('when list is empty', () => {
//     assert.strictEqual(listHelper.mostBlogs([]), null)
//   })
  
//   test('when list has only one blog', () => {
//     assert.strictEqual(listHelper.mostBlogs(listWithOneBlog).author, listWithOneBlog[0].author)
//   })
  
//   test('when list has many blogs', () => {
//     assert.strictEqual(listHelper.mostBlogs(listWithManyBlogs).author, listWithManyBlogs[3].author)
//   })
// })

// describe("author with most likes", () => {
//   test('when list is empty', () => {
//     assert.strictEqual(listHelper.mostLikes([]), null)
//   })

//   test("when list has only one blog", () => {
//     assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {author: "Edsger W. Dijkstra", likes: 5})
//   })
//   test('when list has many blogs', () => {
//     assert.deepStrictEqual(listHelper.mostLikes(listWithManyBlogs), {author: "Edsger W. Dijkstra", likes: 17})
//   })
// })
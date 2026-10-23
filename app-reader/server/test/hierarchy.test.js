import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildTree,
  findChapter,
  getAncestors,
  getDescendantIds,
  nextOrder,
  reorderNode,
  sortNodes,
  summarizeCounts,
  wouldCreateCycle,
} from '../src/services/hierarchy.js'

const nodes = [
  { id: 'story', type: 'story', title: 'Story', parentId: null, order: 0, createdAt: '1' },
  { id: 'ch2', type: 'chapter', title: 'Chapter 2', parentId: 'story', order: 1, createdAt: '2' },
  { id: 'ch1', type: 'chapter', title: 'Chapter 1', parentId: 'story', order: 0, createdAt: '3' },
  { id: 'p1', type: 'passage', title: 'Passage', parentId: 'ch1', order: 0, createdAt: '4', importance: 'high' },
  { id: 'p2', type: 'passage', title: 'Another passage', parentId: 'ch1', order: 1, createdAt: '5' },
  { id: 'word', type: 'word', title: 'Word study', parentId: 'p1', order: 0, createdAt: '6' },
]

test('sortNodes orders siblings by explicit order', () => {
  assert.deepEqual(
    sortNodes(nodes.filter((node) => node.parentId === 'story')).map((node) => node.id),
    ['ch1', 'ch2'],
  )
})

test('buildTree nests children in order with depth', () => {
  const tree = buildTree(nodes)
  assert.equal(tree.length, 1)
  assert.equal(tree[0].id, 'story')
  assert.deepEqual(tree[0].children.map((node) => node.id), ['ch1', 'ch2'])
  assert.equal(tree[0].children[0].depth, 1)
  assert.equal(tree[0].children[0].children[0].id, 'p1')
  assert.equal(tree[0].children[0].children[0].children[0].id, 'word')
})

test('orphaned nodes are treated as roots rather than hidden', () => {
  const tree = buildTree([...nodes, { id: 'lost', type: 'concept', title: 'Lost', parentId: 'missing', order: 0 }])
  assert.ok(tree.some((node) => node.id === 'lost'))
})

test('getDescendantIds walks the whole subtree', () => {
  assert.deepEqual(getDescendantIds(nodes, 'ch1').sort(), ['p1', 'p2', 'word'].sort())
  assert.deepEqual(getDescendantIds(nodes, 'word'), [])
})

test('wouldCreateCycle prevents self-parenting and descendant-parenting', () => {
  assert.equal(wouldCreateCycle(nodes, 'ch1', 'p1'), true)
  assert.equal(wouldCreateCycle(nodes, 'p1', 'p1'), true)
  assert.equal(wouldCreateCycle(nodes, 'p1', 'ch2'), false)
  assert.equal(wouldCreateCycle(nodes, 'ch1', null), false)
})

test('getAncestors and findChapter resolve context', () => {
  assert.deepEqual(getAncestors(nodes, 'word').map((node) => node.id), ['p1', 'ch1', 'story'])
  assert.equal(findChapter(nodes, 'word').id, 'ch1')
  assert.equal(findChapter(nodes, 'story').id, 'story')
  assert.equal(findChapter(nodes, 'missing'), null)
})

test('nextOrder appends after the highest sibling', () => {
  assert.equal(nextOrder(nodes, 'ch1'), 2)
  assert.equal(nextOrder(nodes, null), 1)
})

test('reorderNode swaps order within the same parent only', () => {
  const working = nodes.map((node) => ({ ...node }))
  assert.equal(reorderNode(working, 'ch2', 'up'), true)
  assert.equal(working.find((node) => node.id === 'ch2').order, 0)
  assert.equal(working.find((node) => node.id === 'ch1').order, 1)
  assert.equal(reorderNode(working, 'ch2', 'up'), false)
})

test('summarizeCounts reports research totals for schema v2', () => {
  const sampleNodes = [
    ...nodes,
    { id: 'note1', type: 'note', parentId: 'p1', tags: ['memory'], favorite: true, currentTopic: true },
    { id: 'concept1', type: 'concept', parentId: null, tags: ['memory', 'ritual'] },
  ]
  const counts = summarizeCounts({ nodes: sampleNodes })
  assert.equal(counts.total, 8)
  assert.equal(counts.chapters, 2)
  assert.equal(counts.story, 1)
  assert.equal(counts.passage, 2)
  assert.equal(counts.concept, 1)
  assert.equal(counts.important, 1)
  assert.equal(counts.favorites, 1)
  assert.equal(counts.currentTopics, 1)
  assert.deepEqual(counts.tags, [
    { tag: 'memory', count: 2 },
    { tag: 'ritual', count: 1 },
  ])
})


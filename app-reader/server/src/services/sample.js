import fs from 'node:fs/promises'
import path from 'node:path'
import { pathExists } from '../utils/fsx.js'
import { BOOKS_DIR } from '../config.js'
import { createBook } from './bookStore.js'
import { createNode, updateNode } from './nodes.js'

export const SAMPLE_BOOK_TITLE = 'The Lantern at Low Tide (Fictional Sample)'

/**
 * A small, entirely fictional book used to demonstrate the app: one hierarchy of
 * nodes with every field (serial, type, parent, importance, tags, text, related
 * nodes, favourite, current topic, themes). Every quotation and source here is
 * invented for testing and is clearly labelled as such.
 */
export async function seedSampleBook({ force = false } = {}) {
  const target = path.join(BOOKS_DIR, 'the-lantern-at-low-tide-fictional-sample')
  if (await pathExists(target)) {
    if (!force) return { created: false, bookId: 'the-lantern-at-low-tide-fictional-sample' }
    await fs.rm(target, { recursive: true, force: true })
  }

  const { index } = await createBook(
    {
      title: SAMPLE_BOOK_TITLE,
      author: 'Mara Ellison (fictional author)',
      year: '2025',
      edition: 'Sample edition created for Book Thesis Lab',
      publisher: 'Sample Press — not a real publisher',
      researchQuestion:
        'How does the novel use the lighthouse as a figure for memory, and what does that suggest about the limits of personal testimony?',
      thesisObjective:
        'Build a defensible reading of the lighthouse imagery using close reading and two clearly fictional secondary sources.',
      description: [
        'This is a fictional sample book included with Book Thesis Lab so the interface can be explored safely.',
        'Every quotation, page number, author and source below is invented for demonstration. Do not cite it as real research.',
        'Delete this book from Settings once you start your own project.',
      ].join('\n\n'),
    },
    { sample: true },
  )

  const bookId = index.bookId
  const story = index.nodes[0]
  await updateNode(bookId, story.id, {
    slNo: '1',
    themes: 'memory as repetition',
  })

  const chapterOne = await createNode(bookId, {
    type: 'chapter',
    slNo: '2',
    parentId: story.id,
    importance: 'high',
    tags: ['memory', 'setting'],
    themes: 'memory as repetition',
    text: 'Chapter 1 — The Keeper of the Lamp\n\nOpening chapter. Introduces Ivo, the lighthouse keeper, and the routine of lighting the lamp.\n\nThe narrative voice is careful to distinguish what Ivo remembers from what he can prove.',
  })
  const chapterTwo = await createNode(bookId, {
    type: 'chapter',
    slNo: '3',
    parentId: story.id,
    tags: ['memory', 'testimony'],
    themes: 'testimony and silence',
    currentTopic: true,
    text: 'Chapter 2 — What the Water Kept\n\nSecond chapter. A ledger of missing ships becomes the central object of dispute.',
  })

  const passageOne = await createNode(bookId, {
    type: 'passage',
    slNo: '4',
    parentId: chapterOne.id,
    importance: 'high',
    tags: ['symbolism', 'memory', 'lantern'],
    themes: 'memory as repetition',
    favorite: true,
    text: 'The lamp did not remember the ships, Ivo thought, but it kept the shape of them: a small, patient light rehearsing the same argument against the dark.',
  })
  const lineOne = await createNode(bookId, {
    type: 'line',
    slNo: '5',
    parentId: passageOne.id,
    importance: 'medium',
    tags: ['lantern'],
    themes: 'memory as repetition',
    text: 'a small, patient light rehearsing the same argument against the dark',
  })
  const wordStudy = await createNode(bookId, {
    type: 'word',
    slNo: '6',
    parentId: passageOne.id,
    tags: ['lantern', 'language'],
    themes: 'memory as repetition',
    relatedNodeIds: [lineOne.id],
    text: 'Word study — "rehearsing"\n\nThe word "rehearsing" suggests repetition without an audience: the lamp practices a memory it cannot verify.',
  })
  const passageTwo = await createNode(bookId, {
    type: 'passage',
    slNo: '7',
    parentId: chapterTwo.id,
    importance: 'high',
    tags: ['testimony', 'evidence'],
    themes: 'testimony and silence',
    text: 'A ledger is only a promise that someone was paying attention. The torn page was the promise being kept badly.',
  })
  const passageThree = await createNode(bookId, {
    type: 'passage',
    slNo: '8',
    parentId: chapterTwo.id,
    tags: ['silence', 'testimony'],
    themes: 'testimony and silence',
    text: 'He could have said the name. He set the pencil down instead, and the empty line did the speaking.',
  })

  const interpretation = await createNode(bookId, {
    type: 'note',
    slNo: '9',
    parentId: passageOne.id,
    importance: 'high',
    tags: ['interpretation', 'symbolism'],
    themes: 'memory as repetition',
    relatedNodeIds: [wordStudy.id],
    text: 'Interpretation — light as repeated, not preserved\n\nThe lamp does not store the past; it "rehearses" it. Rehearsal implies variation and performance, not archival accuracy — memory as a practice rather than a container.',
  })
  await createNode(bookId, {
    type: 'note',
    slNo: '10',
    parentId: passageOne.id,
    tags: ['observation', 'narration'],
    text: 'Observation — the narrator hedges Ivo\'s certainty\n\nThe thought is reported as "Ivo thought", not as fact. The narrator keeps a gap between his belief and the text\'s claim.',
  })
  await createNode(bookId, {
    type: 'note',
    slNo: '11',
    parentId: passageTwo.id,
    tags: ['question', 'evidence'],
    themes: 'testimony and silence',
    text: 'Question — is the torn page accidental?\n\nDoes the novel ever explain who tore the page? Track every mention of the ledger in chapters 2 and 3 before treating this as deliberate concealment.',
  })
  await createNode(bookId, {
    type: 'note',
    slNo: '12',
    parentId: chapterTwo.id,
    tags: ['summary'],
    text: 'Summary — chapter 2\n\nThe missing page turns the ledger from a record into a problem. Ivo defends the ledger as evidence; the townspeople read the gap as guilt.',
  })
  const claim = await createNode(bookId, {
    type: 'note',
    slNo: '13',
    parentId: story.id,
    importance: 'high',
    tags: ['thesis-claim', 'memory', 'testimony'],
    relatedNodeIds: [passageOne.id, passageTwo.id, passageThree.id],
    text: 'Working thesis claim\n\nThe lighthouse functions less as a storehouse of memory than as a technology of repetition, which aligns memory with ritual and undermines the novel\'s own evidentiary claims.',
  })

  await createNode(bookId, {
    type: 'concept',
    slNo: '14',
    parentId: null,
    tags: ['theme'],
    themes: 'memory as repetition',
    relatedNodeIds: [passageOne.id, wordStudy.id, interpretation.id],
    text: 'Theme — Memory as repetition\n\nPassages and notes where memory appears as a repeated practice rather than a stored record.',
  })
  await createNode(bookId, {
    type: 'concept',
    slNo: '15',
    parentId: null,
    tags: ['theme'],
    themes: 'testimony and silence',
    relatedNodeIds: [passageTwo.id, passageThree.id, claim.id],
    text: 'Theme — Testimony and silence\n\nEvidence that the novel treats silence and gaps as active records.',
  })
  await createNode(bookId, {
    type: 'concept',
    slNo: '16',
    parentId: null,
    tags: ['source', 'memory'],
    relatedNodeIds: [passageOne.id],
    text: 'Source — Lighthouses and the Poetics of Repetition (fictional source)\n\nExample, A. N. "Lighthouses and the Poetics of Repetition." Journal of Imaginary Maritime Studies 12, no. 2 (2019): 44–67. Fictional citation for sample data.\n\nArgues that lighthouse imagery in maritime fiction tends to encode routine rather than memory. Useful for the repetition reading; not a real publication and must not be cited.',
  })
  await createNode(bookId, {
    type: 'concept',
    slNo: '17',
    parentId: null,
    tags: ['source', 'testimony'],
    relatedNodeIds: [passageTwo.id, passageThree.id],
    text: 'Source — The Ethics of the Missing Page (fictional source)\n\nSample, R. "The Ethics of the Missing Page." In Imagined Archives, 101–120. Sample University Press, 2021. Fictional citation for sample data.\n\nProposes that gaps in archival records are themselves forms of testimony. Contrasts with the repetition reading; good for the contradicting-evidence section.',
  })

  return { created: true, bookId, chapterOne, chapterTwo }
}

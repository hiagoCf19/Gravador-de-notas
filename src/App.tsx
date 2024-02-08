import { ChangeEvent, useState } from 'react'

import { NewNoteCard } from './components/newNoteCard'
import { NoteCard } from './components/notecard'
interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStoorage = localStorage.getItem('notes')
    if (notesOnStoorage) {
      return JSON.parse(notesOnStoorage)
    }
    return []
  })
  function onNoteCreated(content: string) {
    const newNote = {
      // crypto.randomUUID cria um id unico em formato de string
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }
    const notesArray = [newNote, ...notes]
    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))

  }
  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))

  }
  const [search, setSearch] = useState('')
  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)
  }
  //lógica para filtragem:
  const filterNotes = search !== '' ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())) : notes

  return (
    <div className="mx-auto max-w-6xl mt-12 space-y-6 px-5">
      <h1 className='text-6xl font-medium text-slate-500'>Gravador de notas</h1>
      <form action="" className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas"
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
          onChange={handleSearch}
        />
      </form>
      <div className='h-px bg-slate-700' />
      <div className='grid grid-cols-1 md:grid-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filterNotes.map(note => {
          return <NoteCard onNoteDeleted={onNoteDeleted} note={note} key={note.id} />
        })
        }


      </div>
    </div>

  )
}



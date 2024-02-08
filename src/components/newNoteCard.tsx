import * as Dialog from "@radix-ui/react-dialog"

import { X } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "sonner"

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}
let speechRecognition: SpeechRecognition | null = null
export const NewNoteCard = ({ onNoteCreated }: NewNoteCardProps) => {
  const [mostrarOnboarding, setMostrarOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  function handleStarEditor() {
    setMostrarOnboarding(false)
  }
  function handleContentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
    e.target.value === '' ? setMostrarOnboarding(true) : null
    setContent(e.target.value)
  }
  function handleSaveNote(e: FormEvent) {
    if (content === '') {
      return
    }
    e.preventDefault()
    setContent('')
    toast.success("Nota criada com sucesso")
    onNoteCreated(content)
    setMostrarOnboarding(true)
  }
  function handleStartRecording() {
    setIsRecording(true)
    setMostrarOnboarding(false)
    const isSpeechRecOn = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if (!isSpeechRecOn) {
      alert('infelizmente sue navegador não suporta a api de gravação')
      return
    }
    // Aqui é para constatar que o navegador do usuario tem a API disponível, é preciso instalar uma dependencia com o npm install -D  @types/dom-speech-recognition para que o taiwlind reconheça (lembre-se de usar o webkit para o crhome)
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()
    //idioma utilizado
    speechRecognition.lang = 'pt-BR'
    // para não parar de gravar ao parar de falar
    speechRecognition.continuous = true
    //trazer apenas a alternativa que a API julgar correta
    speechRecognition.maxAlternatives = 1
    // trazer resultasod conforme falado e não apenas no final 
    speechRecognition.interimResults = true
    // Essa é a função que será ativada sempre que a api de voz ouvir algo, ela nos tras o resultado
    speechRecognition.onresult = (e) => {
      const transcription = Array.from(e.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }
    // Essa função é capaz de nos mostrar caso ocorra algum erro
    speechRecognition.onerror = (e) => {
      console.error(e)
    }
    // Essa linha starta a gravação
    speechRecognition.start()
  }
  function handleStopRecording() {
    setIsRecording(false)
    if (speechRecognition !== null) {
      speechRecognition.stop()
      console.log('parou de gravar')
    }
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md flex flex-col  bg-slate-700 gap-3  text-left p-5 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'>
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>
        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.DialogPortal>
        <Dialog.DialogOverlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className=" overflow-hidden inset-0 md:inset-auto fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.DialogClose className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" onClick={() => {
              setIsRecording(false)
              setMostrarOnboarding(true)

            }} />
          </Dialog.DialogClose>
          <form className="flex-1 flex flex-col">

            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className='text-sm font-medium text-slate-200'>
                Adicionar nota
              </span>
              {mostrarOnboarding ? (
                <p className='text-sm leading-6 text-slate-400'>
                  Comece&nbsp;
                  <button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline" >
                    gravando uma nota&nbsp;
                  </button>
                  em áudio ou se preferir
                  <button type="button" className="font-medium text-lime-400 hover:underline " onClick={handleStarEditor}>
                    &nbsp;utilize apenas texto
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none outline-none "
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>
            {isRecording ? (
              <button type="button"
                className="w-full bg-slate-900 hover:text-slaste-100 py-4 text-center text-slate-300 outline-none font-medium flex items-center justify-center gap-2 "
                onClick={handleStopRecording}
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse " />
                Gravando! (Clique para interromper)

              </button>


            ) :
              (
                <button type="button"
                  className="w-full bg-lime-400 hover:bg-lime-500 py-4 text-center text-lime-950 outline-none font-medium "
                  onClick={handleSaveNote}
                >
                  Salvar nota
                </button>

              )}


          </form>
        </Dialog.Content>
      </Dialog.DialogPortal>
    </Dialog.Root>

  )
}
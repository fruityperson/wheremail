<template>
  <div class="container mx-auto p-2">
    <div class="flex flex-row items-center justify-end my-2">
      <a
        href="https://github.com/fedor-moiseev/wheremail"
        class="text-gray-400 hover:text-gray-500 transition-colors duration-200"
        ><svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path></svg
      ></a>
    </div>

    <p
      class="flex flex-row justify-center mt-2 items-center text-gray-500 text-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="flex-shrink-0 w-6 h-6 mr-2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      WhereMail
    </p>
    <h1 class="font-bold text-3xl text-center text-gray-900 py-4">
      Generate a list of companies that have your email

    </h1>

    <p class="text-gray-900 text-center mb-4">
      A free software that analyzes your mailbox and makes a list of all
      companies that have sent emails to you. The list can be downloaded as a
      CSV file, which can be used to write what accounts you need and where you
      requested your data.
      <br />
      This software fully works in the browser without a server. It is fully
      free and no account is needed.
    </p>
    <div
      class="border-2 border-dashed border-gray-200 w-full h-64 flex justify-center flex-col text-center"
      @drop="drop"
      @dragover="dragOver"
    >
      <p>Drop a mailbox (mbox) file here</p>
      <p>All the data remain in your browser. Nothing is sent to server.</p>
      <p
        v-if="file"
        class="flex flex-row justify-center my-2 items-center text-gray-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="flex-shrink-0 w-5 h-5 mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>

        File attached
        <code class="font-mono rounded-md bg-gray-100 px-1 ml-1">{{
          file.name
        }}</code>
      </p>
    </div>

    <div v-if="result" class="mt-4 flex flex-row justify-center">
      <a
        :href="result.href"
        target="_blank"
        :download="result.name"
        class="text-base font-medium rounded-lg py-3 px-6 text-white bg-blue-500 mt-4 disabled:opacity-50 flex flex-row items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="flex-shrink-0 h-5 w-5 mr-2"
        >
          <path
            fill-rule="evenodd"
            d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
            clip-rule="evenodd"
          />
        </svg>

        Download CSV
      </a>
    </div>
  </div>
</template>

<script>
import { parseMbox } from '../mbox'
export default {
  data() {
    return {
      file: null,
      result: null,
    }
  },
  methods: {
    drop(event) {
      event.preventDefault()
      const files = event.dataTransfer.items
      if (files[0] && files[0].kind === 'file') this.file = files[0].getAsFile()
      this.submit()
    },
    dragOver(event) {
      event.preventDefault()
    },
    submit() {
      const errors = []
      const reader = new FileReader()

      reader.readAsText(this.file)

      reader.onload = (event) => {
        const result = event.target.result
        if (result) {
          const data = parseMbox(result)
          this.result = data
          return
        }
        errors.push('file missing')
      }
    },
  },
}
</script>

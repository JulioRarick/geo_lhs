import React, { ChangeEvent, useRef } from 'react'

interface FileUploadButtonProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  accept?: string
}

export function FileUploadButton({
  onChange,
  multiple,
  accept
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="mb-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        onChange={onChange}
        accept={accept}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="bg-gray-100 border-sky-300 border hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition duration-150 ease-in-out"
      >
        Selecionar Arquivos
      </button>
    </div>
  )
}

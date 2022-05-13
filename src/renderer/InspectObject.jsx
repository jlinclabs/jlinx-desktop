import * as React from 'react'

export default function InspectObject({ object }){
  let string
  if (typeof object === 'function'){
    string = object.toString()
  }else if (typeof object === 'undefined'){
    string = 'undefined'
  }else{
    try{
      string = inspect(object)
    }catch(error){
      string = `ERROR: ${error}`
    }
  }
  return <pre className="InspectObject">
    <code>{string}</code>
  </pre>
}

function inspect(object, indentation = 2){
  return JSON.stringify(
    object,
    replaceUndefinedWithUndefinedString,
    indentation
  ).replace(/"UNDEFINEDPLACEHOLDER"/g, 'undefined')
}

const replaceUndefinedWithUndefinedString = (k, v) => {
  if (v === undefined) return 'UNDEFINEDPLACEHOLDER'
  if (v instanceof Error) return { message: v.message, stack: v.stack }
  return v
}

const BotaoDeleta = () =>{
  const botaoDeleta = document.createElement('button')

  botaoDeleta.classList.add('delete-button')
  botaoDeleta.innerText = 'deletar'

  botaoDeleta.addEventListener('click', deletarTarefa)

  // botaoDeleta.addEventListener('click', ()=>{
  //   console.log("deletado ")
  // })

  return botaoDeleta
}

const deletarTarefa = (evento) =>{
  const botaoDeleta = evento.target

  const tarefaCompleta = botaoDeleta.parentElement

  // console.log(tarefaCompleta)

  tarefaCompleta.remove()
}


//Exportar o componente

//export por padrao apenas um componente
export default BotaoDeleta

//export mais componentes
// export {
//   BotaoDeleta,
//   deletarTarefa
// }

//export a funcao

//export const BotaoDeleta = () =>{...}
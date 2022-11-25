import { valida} from './validacao.js'

const inputs = document.querySelectorAll('input')

inputs.forEach(input =>{
  if(input.dataset.tipo === 'preco'){
    SimpleMaskMoney.setMask(input, {
        // afterFormat(e) { console.log('afterFormat', e); },
        // allowNegative: false,
        // beforeFormat(e) { console.log('beforeFormat', e); },
        // negativeSignAfter: false,
        prefix: 'R$ ',
        // suffix: '',
        fixed: true,
        fractionDigits: 2,
        decimalSeparator: ',',
        thousandsSeparator: '.',
        // cursor: 'move'
        cursor: 'end'
    })
  }


  input.addEventListener('blur', (evento)=>{
    valida(evento.target)
  })
})

//Mascara monetaria, mais informações no github abaixo.
//https://github.com/codermarcos/simple-mask-money 
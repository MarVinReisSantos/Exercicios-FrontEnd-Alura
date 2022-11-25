// const dataNascimento = document.querySelector('#nascimento')

// dataNascimento.addEventListener('blur', (evento) =>{
//   validaDataNascimento(evento.target)
// })

export function valida(input){
  const tipoDeInput = input.dataset.tipo

  if(validadores[tipoDeInput]){
    validadores[tipoDeInput](input)
  }

  if(input.validity.valid){
    input.parentElement.classList.remove('input-container--invalido')

    input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
  }else{
    input.parentElement.classList.add('input-container--invalido')

    input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input);
  }
}

const tiposDeErro = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'customError'
]

function mostraMensagemDeErro(tipoDeInput, input){
  let mensagem = ''

  tiposDeErro.forEach(erro => {
    if(input.validity[erro]){
      mensagem = mensagensDeErro[tipoDeInput][erro]
    }
  })

  return mensagem
}

// Clique no input e inspecionar elemento, no console cole o comando "$0.validity".
// Vai aparecer todos os campos de estado de validação
const mensagensDeErro = {
  nome:{
    valueMissing: 'O campo nome não pode estar vazio'
  },
  email:{
    valueMissing: 'O email não pode estar vazio.',
    typeMismatch: 'O email digitado não é válido.'
  },
  senha:{
    valueMissing: 'O campo senha não pode estar vazio.',
    patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos'
  },
  dataNascimento:{
    valueMissing: 'O campo data de nascimento não pode estar vazio.',
    customError: 'Você deve ser maior que 18 anos para se cadastrar.'
  },
  cpf:{
    valueMissing: 'O campo de CPF não pode estar vazio.',
    customError: 'O CPF digitado não é válido.'
  },
  cep:{
    valueMissing: 'O campo de CEP não pode estar vazio.',
    patternMismatch: 'O CEP digitado não é válido.',
    customError: 'Não foi possível buscar o CEP.'
  },
  logradouro:{
    valueMissing: 'O logradouro não pode estar vazio.'
  },
  cidade:{
    valueMissing: 'A cidade não pode estar vazia.'
  },
  estado:{
    valueMissing: 'O estado não pode estar vazio.'
  },
  preco: {
    valueMissing: 'O campo de preço não pode estar vazio'
  }

}

const validadores = {
  dataNascimento:input => validaDataNascimento(input),
  cpf:input => validaCPF(input),
  cep:input => recuperarCEP(input)
}

function validaDataNascimento(input){
  const dataRecebida = new Date(input.value)
  let mensagem = ''

  if(!maiorQue18(dataRecebida)){
    mensagem = 'Você deve ser maior que 18 anos para se cadastrar.'
    // alert(mensagem)
    // dataNascimento.value = ""
  }
  input.setCustomValidity(mensagem);
}

function maiorQue18(hoje){
  const dataAtual = new Date()

  const dataMais18 = new Date(hoje.getUTCFullYear()+18, hoje.getUTCMonth(), hoje.getUTCDate())

  return dataMais18 <= dataAtual
}


function validaCPF(input){
  const cpfFormatado = input.value.replace(/\D/g, '')
  let mensagem = ''

  if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)){
    mensagem = 'O CPF digitado não é válido.'
  }
  input.setCustomValidity(mensagem)

}

function checaCPFRepetido(cpf){
  const valoresRepetidos = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999'
  ]

  let cpfValido = true

  valoresRepetidos.forEach(valor => {
    if(valor == cpf){
      cpfValido = false;
    }
  })

  return cpfValido
}

function checaEstruturaCPF(cpf){
  const multiplicador = 10

  return checaDigitoVerificador(cpf, multiplicador)
}


function checaDigitoVerificador(cpf, multiplicador){

  if(multiplicador >= 12){
    return true
  }

  let multiplicadorInicial = multiplicador
  let soma = 0
  const cpfSemDigitos = cpf.substr(0, multiplicador-1).split('')
  const digitoVerificador = cpf.charAt(multiplicador - 1)

  for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--){
    soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
    contador ++
  }

  if(digitoVerificador == confirmaDigito(soma)){
    return checaDigitoVerificador(cpf, multiplicador + 1)
  }

  return false
}

function confirmaDigito(soma){
  return 11 - (soma % 11)
}

// 123 456 789 09

// let soma = (10 * 1) + (9 * 2) + (8 * 3) ... (2 * 9) ->Para verificar o primeiro numero

// let soma = (11 * 1) + (10 * 2) + (9 * 3) ... (2 * 0) ->Para verificar o segundo numero


function recuperarCEP(input){
  const cep = input.value.replace(/\D/g, '')
  const url = `https://viacep.com.br/ws/${cep}/json/`
  
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  }

  if(!input.validity.patternMismatch && !input.validity.valueMissing){
    fetch(url, options).then(
      response => response.json()
    ).then(
      data =>{
        if(data.erro){
          input.setCustomValidity('Não foi possível buscar o CEP.')
          return 
        }

        input.setCustomValidity('')

        preencherCamposComCEP(data)
        return
      }
    )
  }
}

function preencherCamposComCEP(data){
  const logradouro = document.querySelector('[data-tipo="logradouro"]')
  const cidade = document.querySelector('[data-tipo="cidade"]')
  const estado = document.querySelector('[data-tipo="estado"]')

  logradouro.value = data.logradouro
  cidade.value = data.localidade
  estado.value = data.uf
}
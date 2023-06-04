






function codificarParaURL(msg) {
    return encodeURIComponent(msg);
  }

  var mensagem = "Olá, Luiz!";
  var mensagemCodificada = codificarParaURL(mensagem);
  console.log(mensagemCodificada);

function something() {
}

function validate1(a, c) {
    let foo = a.b
    if (!foo || something()) {
        throw 'error';
    }
    c(1)
}


function validate2(a, c) {
  let foo = a.b
  if (foo && something()) {
    throw Error('error')
  }
  c(1)
}

function somethingTrue() {
  return true
}

function somethingFalse() {
  return false
}

function validate1true(a, c) {
  let foo = a.b
  if (!foo || somethingTrue()) {
    throw Error('error')
  }
  c(1)
}

function validate1false(a, c) {
  let foo = a.b
  if (!foo || somethingFalse()) {
    throw Error('error')
  }
  c(1)
}


function validate2true(a, c) {
  let foo = a.b
  if (foo && somethingTrue()) {
    throw Error('error')
  }
  c(1)
}

function validate2false(a, c) {
  let foo = a.b
  if (foo && somethingFalse()) {
    throw Error('error')
  }
  c(1)
}

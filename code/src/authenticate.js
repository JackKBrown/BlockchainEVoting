function generate(){
  //get data
  const public_key = BigInt($('#public_key').val());
  const big_N = BigInt($('#big_N').val());
  const client_address = $('#address').val();
  //validate address
  
  //get storage fields
  const $inverse_blinding_factor = $('#r_inverse');
  const $m_dash = $('#m-');
  
  //get random number
  var r = NaN;
  var r_inverse = NaN;
  while(!r_inverse){
    r = BigInt(rand_rel_prime(0,Number.MAX_SAFE_INTEGER, big_N));
    r_inverse = bigint_mod_inverse(r,big_N);
  }
  $inverse_blinding_factor.val("0x"+r_inverse.toString(16));
  
  //blind message
  const message = BigInt(client_address);
  const m_dash = BigInt((message*(r**public_key))%big_N);
  $m_dash.val("0x"+m_dash.toString(16))

  $('#submit').show();
}

function verify(){
  const public_key = BigInt($('#public_key').val());
  const big_N = BigInt($('#big_N').val());
  const signed_blinded_m = BigInt($('#signed_blinded_m').val());
  const r_inverse = BigInt($('#r_inverse').val());
  const client_address = $('#address').val().toLowerCase();
  
  const $token = $('#s-');
  
  //unblind
  const signed_m = BigInt((signed_blinded_m*r_inverse)%big_N);
  $token.val("0x"+signed_m.toString(16));
  
  //verify it matches
  const extracted_m = bigint_mod_pow(signed_m, public_key, big_N);
  console.log("extracted_m");
  console.log("0X"+extracted_m.toString(16));
  console.log("original_m");
  console.log(client_address);
}

//bigint has a size limit of 1m bits ((2^2048)^2048)~4m so need modpow
//modpow should also be faster than pow then mod
function bigint_mod_pow(base, exp, mod){
  if (mod == 1n) return 0;
  base = base%mod;
  var result = BigInt(1);
  while(exp>0n){
    if(exp % 2n == 1n) {
      result = ((result*base)%mod);
      exp = (exp-1n)/2n;
    }else{
      exp = exp/2n;
    }
    base = (base**2n)%mod;
  }
  return result
}

//random is currently bounded by max int size.
function rand_rel_prime(min, max, n){
  var r = BigInt(Math.floor(Math.random() * (max - min + 1) ) + min);
  var t = bigint_gcd(r, n);
  while (t > 1n){
    r = r / t;
    t = bigint_gcd(r, n);
  }
  return r;
}

function bigint_gcd(x,y){
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function bigint_mod_inverse(a, m) {
  // find the gcd
  const s = []
  let b = m
  while(b) {
    [a, b] = [b, a % b]
    s.push({a, b})
  }
  if (a != 1) {
    return NaN // inverse does not exist
  }
  // find the inverse
  let x = 1n
  let y = 0n
  for(let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y,  x - y * BigInt(s[i].a / s[i].b)]
  }
  return (y % m + m) % m
}




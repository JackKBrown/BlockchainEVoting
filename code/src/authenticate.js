function generate(){
  //get data
  const public_key = BigInt($('#public_key').val());
  const big_N = BigInt($('#big_N').val());
  const client_address = $('#address').val();
  //validate address
  
  //get storage fields
  const $hash_m = $('#H_m');
  const $blinding_factor = $('#r');
  const $blinded_hash_m = $('#m-');
  
  //create message hash
  var bitArray = sjcl.hash.sha256.hash(client_address);  
  var digest_sha256 = sjcl.codec.hex.fromBits(bitArray);
  $hash_m.val(digest_sha256);
  
  //get random number
  var r = NaN;
  var r_inverse = NaN;
  while(!r_inverse){
    r = BigInt(rand_rel_prime(0,Number.MAX_SAFE_INTEGER, big_N));
    r_inverse = bigint_mod_inverse(r,big_N);
  }
  console.log("r and r inverse");
  console.log(r);
  console.log(r_inverse);
  $blinding_factor.val(r);
  
  //blind message
  const hash_decimal = BigInt("0x"+digest_sha256);
  const m_dash = BigInt((hash_decimal*(r**public_key))%big_N);
  $blinded_hash_m.val(m_dash);

  $('#submit').show();

}

function verify(){
  const public_key = BigInt($('#public_key').val());
  const big_N = BigInt($('#big_N').val());
  const signed_blinded_m = BigInt($('#signed_blinded_m').val());
  const r_inverse = BigInt($('#r_inverse').val());
  const client_address = $('#address').val();
  
  //unblind
  const signed_m = BigInt((signed_blinded_m*r_inverse)%big_N);
  console.log("signed_m");
  console.log(signed_m);
  
  //get hashed message
  var bitArray = sjcl.hash.sha256.hash(client_address);  
  var digest_sha256 = sjcl.codec.hex.fromBits(bitArray);
  const hash_decimal = BigInt("0x"+digest_sha256);
  
  //const extracted_m = BigInt((signed_m**public_key)%big_N);
  const extracted_m = bigint_mod_pow(signed_m, public_key, big_N);
  console.log("extracted_m");
  console.log(extracted_m);
  console.log("original_m");
  console.log(hash_decimal);
}

//bigint has a size limit of 1m bits ((2^2048)^2048)~4m
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
    //console.log(x);
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
    return NaN // inverse does not exists
  }
  // find the inverse
  let x = 1n
  let y = 0n
  for(let i = s.length - 2; i >= 0; --i) {
    [x, y] = [y,  x - y * BigInt(s[i].a / s[i].b)]
  }
  return (y % m + m) % m
}




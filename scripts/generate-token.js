#!env node
/* eslint-disable max-len, no-console */

/**
 * Usage example
 *
 * Generate:
 * $ node scripts/generate-token.js generate [data]
 *
 * While data value is JSON.stringify forwat, e.g. :
 * {
 *   sub: 'amir@nodomain.com',
 *   profile: {
 *     accountId: '1',
 *     usrRegistrantId: '1',
 *     uname: 'amirun',
 *     email: 'amir@nodomain.com',
 *     phone: '+6286313149xxx',
 *     name: 'Pak Amir'
 *   },
 *   roles: ['owner'],
 *   scope: 'offline_access',
 *   client_id: 'all-in-one-client',
 *   aud: 'http://localhost:3001/xyz',
 * }
 *
 *
 * Decode:
 * $ node scripts/generate-token.js decode [token]
 *
 * While token value is string JWT format, e.g. :
 * eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJh
 * bWlyQG5vZG9tYWluLmNvbSIsInByb2ZpbGUiOnsiYWNjb3Vud
 * ElkIjoiMSIsInVzclJlZ2lzdHJhbnRJZCI6IjEiLCJ1bmFtZS
 * I6ImFtaXJ1biIsImVtYWlsIjoiYW1pckBub2RvbWFpbi5jb20
 * iLCJwaG9uZSI6Iis2Mjg2MzEzMTQ5eHh4IiwibmFtZSI6IlBh
 * ayBBbWlyIn0sInJvbGVzIjpbIm93bmVyIl0sInNjb3BlIjoib
 * 2ZmbGluZV9hY2Nlc3MiLCJjbGllbnRfaWQiOiJhbGwtaW4tb2
 * 5lLWNsaWVudCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzA
 * wMS94eXoiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAi
 * LCJleHAiOjE2OTY5MDk4OTAsImlhdCI6MTY2NTM2OTg5MH0.c
 * 2nnai75Ludg2t86UBoBWT60dY8c5m-s3grTNU1hag5GcDJErN
 * 0WsSHmAyxdDMO7T77A6bPWPBZagzIEl7V-N-NPwC1D9AwMvye
 * qBDcAHCfHMHbUJh_KiCS-BtA68Wx9nw72Q1Fefn2sjQ6Pb_DJ
 * B_oUUm1j2mf6W76f2Ma06n06i9IM74vzSR4yu6tE_0yjipBfr
 * Lm9aRgreMrwylarX_InQs0vcNDQowLyWFTGDdWfWWpF02LQM3
 * 85jy_ohnPDWmfg1DXshEayvoengtv61OaOeU70B4T6zWWUeKV
 * 8K1ARO4LAnk2sE__dn48v2h-cYkps3NkTRcy8YRuOQZQiEw
 */

const { hosts } = require('../config');
const { generate, decode } = require('../utils/token');

const now = Math.floor(new Date().getTime() / 1000);
const duration = 3.154e+7 // 1 year
const flag = process.argv[2] || 'generate';
const payload = process.argv[3];

if (flag === 'generate') {
  try {
    const data = JSON.parse(payload);
    data.iss = hosts.svc.this
    data.exp = now + duration

    console.log('Generate with data:', data);
    generate(data).then((token) => console.log('Token value:', token));
  } catch (e) {
    console.error(e);
  }
} else {
  decode(payload).then((data) => console.log('Decoded token:', data))
}

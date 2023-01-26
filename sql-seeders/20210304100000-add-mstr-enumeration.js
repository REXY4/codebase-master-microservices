/* eslint-disable no-param-reassign, no-restricted-syntax */

const Enum = {
  app: {
    beOAuth: 'be-ms-oauth',
    beMaster: 'be-master',
    beUser: 'be-ms-user',
    beCourier: 'be-ms-courier',
    beDocument: 'be-ms-document',
    beProject: 'be-ms-project',
    beTask: 'be-ms-task',
    beBilling: 'be-ms-billing',
    bePayment: 'be-ms-payment',
    beCMS: 'be-ms-cms',
    beEvent: 'be-ms-event',
    beStream: 'be-ms-stream',
    beDatastore: 'be-ms-datastore',
    beLogging: 'be-ms-logging',
    feAdmin: 'fe-ms-web-admin',
    fePortal: 'fe-ms-web-portal',
    feClient: 'fe-ms-web-client',
    feExpert: 'fe-ms-web-expert',
    feMeet: 'fe-ms-web-meet',
    feMobile: 'fe-mobile',
  },
  httpMethod: {
    add: 'POST',
    get: 'GET',
    remove: 'DELETE',
    update: 'PUT'
  },
  isActive: {
    active: '1',
    deactive: '0',
    deleted: '-1'
  },
  verifyStatus: {
    pending: 'pending',
    accepted: 'accepted',
    refused: 'refused'
  },
  courierType: {
    sms: 'sms',
    email: 'email',
    whatsapp: 'whatsapp',
    telephone: 'telephone',
    notification: 'notification'
  },
  timeUnitType: {
    second: 'second',
    minute: 'minute',
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
    year: 'year'
  },
  measureUnitType: {
    k: 'kilo',
    h: 'hekto',
    m: 'meter'
  },
  documentType: {
    audio: 'audio',
    picture: 'picture',
    video: 'video',
    file: 'file'
  },
  documentScope: {
    identity: 'identity',
    portfolio: 'portfolio',
    attainment: 'attainment',
    expertise: 'expertise',
    experience: 'experience',
    project: 'project',
    milestone: 'milestone',
    epic: 'epic',
    story: 'story',
    task: 'task',
    subTask: 'sub task',
    bugFix: 'sub task',
    article: 'article',
    event: 'event',
    comment: 'comment',
    conversation: 'conversation',
    billing: 'billing',
    invoice: 'invoice',
    receipt: 'receipt',
    payment: 'payment',
    letter: 'letter',
    other: 'other'
  },
  expertiseType: {
    interest: 'interest',
    skill: 'skill'
  },
  expertiseLevel: {
    basic: 'basic',
    intermediate: 'intermediate',
    expert: 'expert'
  },
  employeeType: {
    internship: 'internship',
    freelance: 'freelance',
    outsourced: 'outsourced',
    contract: 'contract',
    permanent: 'permanent'
  },
  employeeLevel: {
    junior: 'junior',
    intermediate: 'intermediate',
    senior: 'senior'
  },
  employeeFunction: {
    staff: 'staff',
    manager: 'manager',
    supervisior: 'supervisior',
    director: 'director'
  },
  educationDegreeType: {
    diploma: 'undergraduate',
    associate: 'associate',
    bachelor: 'bachelor',
    master: 'master',
    doctor: 'doctor'
  },
  taskType: {
    milestone: 'milestone',
    epic: 'epic',
    story: 'story',
    task: 'task',
    subTask: 'sub task',
    bugFix: 'bug fixing'
  },
  paymentType: {
    cash: 'cash',
    gift: 'gift',
    credit: 'credit card',
    debit: 'debit card',
    prepaid: 'prepaid card',
    transfer: 'bank transfer',
    va: 'virtual account',
    mobile: 'mobile payment',
    crypto: 'crypto currency',
    gateway: 'gateway',
    onlieCredit: 'online credit card',
    other: 'other'
  },
  projectStatus: {
    open: 'open',
    partial: 'partial',
    closed: 'closed'
  },
  proposalStatus: {
    pending: 'pending',
    negotiation: 'negotiation',
    approved: 'approved',
    rejected: 'rejected',
    drawBack: 'draw back'
  },
  paymentStatus: {
    pending: 'pending',
    issurance: 'issurance',
    paid: 'paid'
  },
  meetAgendaType: {
    screening: 'screening',
    negotiation: 'negotiation',
    discussion: 'discussion'
  },
  attendingPlan: {
    attend: 'attend',
    maybe: 'maybe',
    decline: 'decline'
  }
};

function getEnumeration() {
  return Enum
}

function flattenNestedObj(obj, temp = {}, key = '') {
  for (const k in obj) {
    if (typeof obj[k] === 'object') {
      flattenNestedObj(obj[k], temp, key ? `${key}.${k}` : k);
    } else {
      const kk = key ? `${key}.${k}` : k
      temp[kk] = obj[k];
    }
  }
  return Object.keys(temp).map((k) => ({
    key: k,
    value: temp[k],
    createdBy: 'SYSTEM',
    notes: 'autocreated'
  }))
}

module.exports = {
  getEnumeration,
  flattenNestedObj,
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('mstrEnumerations', flattenNestedObj(Enum)),
  down: async (queryInterface, Sequelize) => {
    const { Op } = Sequelize;
    const condition = {
      [Op.or]: flattenNestedObj(Enum).map((record) => ({
        ...record,
        updatedBy: null,
        updatedAt: null
      }))
    }
    return queryInterface.bulkDelete('mstrEnumerations', condition)
  }
}

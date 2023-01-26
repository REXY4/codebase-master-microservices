const Promise = require('bluebird')
const nodemailer = require('nodemailer')
const ejs = require('ejs');
const path = require('path');
const Email = require('email-templates');

const { sender, receiver, transport } = require('../config/mail-standard')

const transporter = Promise.promisifyAll(nodemailer.createTransport(transport))

async function getTemplate(subject, template, data) {
  const baseDirectory = `template/subject/${subject}`;
  const email = new Email({
    juice: true,
    juiceSettings: {
      tableElements: ['TABLE']
    },
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: path.resolve(__dirname, '..', baseDirectory)
      }
    },
    preview: false,
    send: false,
    views: { options: { extension: 'ejs' } },
    render: () => new Promise((resolve, reject) => {
      Promise.all([
        email.juiceResources(ejs.render(template.subject, data)),
        email.juiceResources(ejs.render(template.content, data)),
        email.juiceResources(ejs.render(template.htmlContent, data))
      ]).then(resolve).catch(reject)
    })
  });

  return email.render(data)
}

async function send(options) {
  const config = {
    to: receiver.email,
    from: `"${sender.name}" <${sender.email}>`,
    ...options
  }

  if (process.env.NODE_ENV === 'test' || !send.server) {
    console.log('Sending mail', config)
  } else {
    send.server.logger.info(config, 'Sending mail')
  }

  const mail = await transporter.sendMailAsync(config)

  if (process.env.NODE_ENV === 'test' || !send.server) {
    console.log('Response mail', mail)
  } else {
    send.server.logger.info(mail, 'Response mail')
  }

  return mail
}

module.exports = { getTemplate, send }

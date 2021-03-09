import tld from 'tldjs'
import _ from 'lodash'
import stringify from 'csv-stringify/lib/browser/sync'
// import tosdr from './tosdr'

// const breaches = []

// const getScore = (site) => {
//   const tosdrClass = tosdr[String(site)]?.class
//   const tosdrScore = tosdr[String(site)]?.score

//   if (tosdrClass || tosdrScore) {
//     let score = 5

//     // asign a score value to the classes/scores provided in the JSON file
//     if (tosdrClass === 'A') {
//       score = 0
//     } else if (tosdrClass === 'B') {
//       score = 1
//     } else if (tosdrClass === 'D' || tosdrScore > 150) {
//       score = 10
//     } else if (tosdrClass === 'C' || tosdrScore > 100) {
//       score = 7
//     }
//     return score
//   }
// }

const toCsv = (data) => {
  // const headers = Object.keys(data[0])

  //  'Data Types',
  // 'Privacy Score',
  // 'Breach',
  // 'Usage',
  const headers = ['Domain', 'Joined', 'Needed', 'Reclaimed']
  const contents = data.map((row) => Object.values(row))
  const csv = stringify([headers, ...contents])
  return csv
}

const toUrl = (csv) => {
  const blob = new Blob(['\uFEFF', csv])
  const href = URL.createObjectURL(blob)
  const name = `mbox.csv`
  return {
    href,
    name,
  }
}

export const parseMbox = (mbox) => {
  const messages = mbox.split('\nFrom ').map((message) => {
    const line = message.replace('From ', '').split('\n')[0]

    const when = line.split(' ')
    const sender = when.shift()

    const match = message.match(/From: .*@.*/g)

    const senderGmail =
      match && match[0].match(/(<.*@.*>)|\S*@.*/g)[0].replace(/<|>/g, '')

    const date = new Date(when.join(' '))
    let senderDomain = sender && sender.split('@')[1]
    if (senderDomain === 'xxx')
      senderDomain = senderGmail && senderGmail.split('@')[1]
    const site = tld.getDomain(senderDomain) || senderDomain

    const result = {
      date,
      domain: site,
    }

    return result
  })

  const groups = _.groupBy(messages, (message) => message.domain)
  // let csv = 'Domain, Date Joined';
  const companies = Object.values(groups).map((group) => {
    const first = _.sortBy(group, ['date'])[0]

    const { domain } = first
    // const privacyScore = getScore(first.domain)
    // const breach = breaches.find((breach) => breach.Domain === first.domain)

    return {
      domain,
      joined: new Date(first.date).toDateString(),
    }

    // return {
    //   domain,
    //   joined: first.date,
    //   ...(privacyScore ? { privacyScore } : {}),
    //   ...(breach ? { breach } : {}),
    // }
  })
  const csv = toCsv(companies)
  const { name, href } = toUrl(csv)
  return { companies, csv, name, href }
}

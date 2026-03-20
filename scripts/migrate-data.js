const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', 'data')
const responsesDir = path.join(dataDir, 'responses')

if (!fs.existsSync(responsesDir)) {
  fs.mkdirSync(responsesDir, { recursive: true })
}

// Migrate home survey
const oldSurveys = path.join(dataDir, 'surveys.json')
if (fs.existsSync(oldSurveys)) {
  const old = JSON.parse(fs.readFileSync(oldSurveys, 'utf-8'))
  const migrated = old.map(r => ({
    id: r.id,
    slug: 'home',
    identity: {
      threadsAccount: r.name,
      email: r.email,
    },
    answers: r.answers,
    submittedAt: r.submittedAt,
  }))
  fs.writeFileSync(path.join(responsesDir, 'home.json'), JSON.stringify(migrated, null, 2), 'utf-8')
  console.log(`Migrated ${migrated.length} home survey responses`)
}

// Migrate english-speaking
const oldEvent = path.join(dataDir, 'english-speaking.json')
if (fs.existsSync(oldEvent)) {
  const old = JSON.parse(fs.readFileSync(oldEvent, 'utf-8'))
  const migrated = old.map(r => ({
    id: r.id,
    slug: 'english-speaking',
    identity: {
      name: r.name,
      phone: r.phone,
      email: r.email || '',
    },
    answers: { attendConfirm: 'true' },
    submittedAt: r.submittedAt,
  }))
  fs.writeFileSync(path.join(responsesDir, 'english-speaking.json'), JSON.stringify(migrated, null, 2), 'utf-8')
  console.log(`Migrated ${migrated.length} english-speaking registrations`)
}

console.log('Migration complete!')

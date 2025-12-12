import http from 'http'

function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: JSON.parse(data),
        })
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function test() {
  try {
    console.log('Testing signup...')
    const signup = await makeRequest('POST', '/api/auth/signup', {
      email: 'test@test.com',
      password: 'password123',
      name: 'Test User',
    })
    console.log('Signup response:', signup)

    if (signup.status === 200 && signup.body.success) {
      console.log('✓ Signup successful')

      console.log('\nTesting login...')
      const login = await makeRequest('POST', '/api/auth/login', {
        email: 'test@test.com',
        password: 'password123',
      })
      console.log('Login response:', login)

      if (login.status === 200 && login.body.success) {
        console.log('✓ Login successful')
      } else {
        console.log('✗ Login failed:', login.body)
      }
    } else {
      console.log('✗ Signup failed:', signup.body)
    }
  } catch (err) {
    console.error('Error:', err.message)
  }

  process.exit(0)
}

test()

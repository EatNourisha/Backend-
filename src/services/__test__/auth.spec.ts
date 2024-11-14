// import  request  from 'supertest';
import {setUpTestDB} from '../../utils'
import {faker} from '@faker-js/faker'
// import httpStatus from 'http-status';
// import app from '../../../app'
setUpTestDB();

describe('Auth Routes', () =>{
    describe('POST /v1/auth/register', () =>{
        let newCustomer;
        beforeEach(()=>{
            newCustomer = {
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                password: 'Zuby@2002',
                email: faker.internet.email().toLowerCase(),
                phone: faker.number.int(),
                gender: 'female',
                avatar: faker.image.avatar(),
                address:  {
                    address_: faker.address.street(),
                    city:faker.address.city(),
                    country: faker.address.country(),
                    postcode: faker.address.zipCode()
                    }
            }
        })
        test('should return 201 upon sucessful registration', async ()=>{
    
            // await request(app).post('POST /v1/auth/login').send(newCustomer).expect(httpStatus.CREATED)
       
        })
    })


})
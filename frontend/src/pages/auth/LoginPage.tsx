// WHAT: Login page with email + password form
// IMPORTS: formik, validations/authValidation, services/authService, hooks/useAuth
// FLOW: submit form → call loginService → save to authStore → redirect by role
//   super_admin → /admin/dashboard
//   shop_admin  → /owner/dashboard
//   customer    → /

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema } from '../../validations/authValidation'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (
        values: {
            email: string;
            password: string;
        },
        { setSubmitting} : any
    ) => {
        setErrorMsg('')
        try{
            const data = await login(values.email, values.password);

            if(data.user.role === 'shop_admin'){
                navigate('/owner/dashboard')
            } else if (data.user.role === 'super_admin'){
                navigate('/admin/shops')
            } else {
                navigate('/')
            }
        } catch (err: any){
            setErrorMsg(
                err?.response?.data?.message || 'Login failed, Check your email and password'
            )
        } finally{
            setSubmitting(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-md p-8'>
                <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>

                {errorMsg && (
                    <div className='mb-4 p-3 bg-red-100 text-red-700 rounded text-sm'>
                        {errorMsg}
                    </div>
                )}

                <Formik
                    initialValues={{email: '', password: ''}}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        values, errors, touched, handleChange, handleBlur, isSubmitting
                    }) =>(
                        <Form>
                            <Input
                                name='email'
                                type='email'
                                label='Email'
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email ? errors.email :undefined}
                            />

                            <Input 
                                name='password'
                                type='password'
                                label='password'
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password ? errors.password : undefined}
                            />

                            <Button 
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full mt-4'
                            >
                                {isSubmitting ? <Spinner/> : 'Login'}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <p className='mt-4 text-center text-sm text-gray-600'>
                    Don't have an account? {''}
                    <Link
                        to='/register'
                        className='text-blue-600 hover:underline'
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage

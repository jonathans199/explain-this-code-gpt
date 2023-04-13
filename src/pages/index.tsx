import * as React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'

import Editor from '@monaco-editor/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const [loading, setLoading] = React.useState<boolean>(false)
	const [userCode, setUserCode] = React.useState<string>('')
	const [gptResponse, setGptResponse] = React.useState<any>({})

	const handleTextInput = (e: React.SetStateAction<string>) => {
		setUserCode(e)
	}

	const handleClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		setUserCode('')
		setGptResponse('')
		setLoading(false)
	}

	const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true)
		setGptResponse({})
		e.preventDefault()
		const res = await fetch(`/api/explain`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userCode),
		})

		const data = await res.json()

		setGptResponse(data)
		setLoading(false)
	}

	function Spinner() {
		return (
			<span className='w-full flex justify-center items-center'>
				<span className='animate-spin relative flex h-10 w-10 rounded-lg bg-red-600 opacity-75'></span>
			</span>
		)
	}

	return (
		<>
			<Head>
				<title>Explain this code! </title>
				<meta
					name='description'
					content='Explain This Code, is a web-based application that uses artificial intelligence to explain lines of
								programming code. It is a valuable tool for developers of all levels of experience, from beginners
								learning new programming languages to experienced developers debugging code.'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<section className='bg-gray-50'>
					<div className='mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center'>
						<div className='mx-auto max-w-xl text-center'>
							<h1 className='text-3xl font-extrabold sm:text-5xl'>
								Welcome to
								<strong className='font-extrabold text-red-700 sm:block'>Explain this code!</strong>
							</h1>
							<h2>( Javascript only for now 😎 )</h2>

							<p className='mt-4 sm:text-xl sm:leading-relaxed'>
								Explain This Code, is a web-based application that uses artificial intelligence to explain lines of
								programming code.
							</p>

							<div className='my-8 flex flex-wrap justify-center gap-4'>
								<form
									action='submit'
									method='post'
									onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleCodeSubmit(e)}>
									<Editor
										height='40vh'
										width='70vh'
										defaultLanguage='javascript'
										defaultValue='// Javascript code here'
										onChange={(e: any) => handleTextInput(e)}
										theme='vs-dark'
										value={userCode}
									/>
									<small>shift + option + f ={'>'} to format code</small>
									<div className='flex justify-center'>
										<button
											className='block w-full rounded bg-red-600 px-12 py-3 my-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto'
											type='submit'
											disabled={loading}>
											Explain
										</button>
										<button
											onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleClear(e)}
											className='block w-full rounded bg-red-600 px-12 py-3 my-3 ml-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto'
											type='submit'>
											Clear
										</button>
									</div>
								</form>
								{loading && <Spinner />}

								{gptResponse.content && (
									<>
										<h2 className='font-extrabold text-red-700 sm:block'>Explanation here: </h2>
										<p className='text-left '>{gptResponse.content}</p>
									</>
								)}
							</div>
						</div>
					</div>
					<a
						href='https://github.com/jonathans199/explain-this-code-gpt'
						target='_blank'
						rel='noopener noreferrer'
						className='flex justify-center'>
						<Image src='/github-mark.png' alt='' width={20} height={20} />
					</a>
					<footer className='flex justify-center items-center font-light text-red-700 text-xs mb-3'>
						by&nbsp;
						<a href='http://www.jonathansanchez.dev' target='_blank' rel='noopener noreferrer'>
							jonathansanchez.dev
						</a>
						{/* <Image src='/jons-logo.png' alt='' width={20} height={20} /> */}
					</footer>
				</section>
			</main>
		</>
	)
}

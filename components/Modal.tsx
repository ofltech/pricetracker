'use client'

import { useState, Fragment, FormEvent } from 'react'
import { Transition, Dialog } from '@headlessui/react';
import Image from 'next/image'
import { addUserEmailToProduct } from '@/lib/actions'

interface Props {
  productId: string
}

const Modal = ({ productId }: Props) => {
  let [isOpen, setIsOpen] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Prevent page reload.
    event.preventDefault();
    setIsSubmitting(true);

    await addUserEmailToProduct(productId, email);

    setIsSubmitting(false)
    setEmail('')
    closeModal()
  }

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button type="button" className="btn" onClick={openModal}>
        Track
      </button>

      {/* HeadlessUI Dialog Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog className="dialog-container" as="div" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">

            {/* First Transition Child */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* Self closing Span to center modal contents */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            />

            {/* Second Transition Child - Actual Modal */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="dialog-content">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-200 rounded-10">
                      <Image
                        src="/assets/icons/logo.svg"
                        width={28}
                        height={28}
                        alt="logo"
                      />
                    </div>

                    <Image
                      className="cursor-pointer"
                      src="/assets/icons/x-close.svg"
                      width={24}
                      height={24}
                      alt="close"
                      onClick={closeModal}
                    />
                  </div>

                  <h4 className="dialog-head_text">
                    Stay updated with product pricing alerts right in your inbox!
                  </h4>

                  <p className="text-sm text-gray-600 mt-2">
                    Never miss a bargain again with our timely alerts!
                  </p>
                </div>

                {/* Submit Email Form */}
                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email addrress
                  </label>
                  <div className="dialog-input_container">
                    <Image
                      src="/assets/icons/mail.svg"
                      width={18}
                      height={18}
                      alt="mail"
                    />

                    <input
                      className="dialog-input"
                      id="email"
                      type="email"
                      value={email}
                      required
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <button type="submit" className="dialog-btn">
                    {/* Check if Submitting email or not and display correct wording. */}
                    {isSubmitting ? 'Submitting...' : 'Track'}
                  </button>
                </form>
              </div>
            </Transition.Child>

          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Modal

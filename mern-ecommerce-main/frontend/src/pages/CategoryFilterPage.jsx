import React, { useEffect } from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import {Subnavbar} from '../features/navigation/components/Subnavbar';
import { Brand } from '../features/categories/Brand'
import { resetAddressStatus, selectAddressStatus } from '../features/address/AddressSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Footer } from '../features/footer/Footer'

export const CategoryFilterPage = () => {
  const dispatch = useDispatch()
  const addressStatus = useSelector(selectAddressStatus)
  useEffect(() => {
    if (addressStatus === 'fulfilled') {

      dispatch(resetAddressStatus())
    }
  }, [addressStatus])

  return (
    <>
    <Subnavbar/>
      <Navbar  />
      <Brand />
      <Footer />
    </>
  )
}

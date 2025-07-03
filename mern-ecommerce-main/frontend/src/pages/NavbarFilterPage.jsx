import React, { useEffect } from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import {Subnavbar} from '../features/navigation/components/Subnavbar';
import { Category } from '../features/categories/Category'
import { resetAddressStatus, selectAddressStatus } from '../features/address/AddressSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Footer } from '../features/footer/Footer'

export const NavbarFilterPage = () => {
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
      <Navbar/>
      <Category/>
      <Footer />
    </>
  )
}

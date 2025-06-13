import { useState } from 'react'

export const useFields = (initialState = {}) => {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState({})

  const onChange = (fieldName) => (e) => {
    const value = e.target.value
    setValues(prev => ({ ...prev, [fieldName]: value }))
    setErrors(prev => ({ ...prev, [fieldName]: '' }))
  }

  const resetFields = () => {
    setValues(initialState)
    setErrors({})
  }

  const validate = () => {
    const newErrors = {}
    for (const field in values) {
      if (!values[field].trim()) {
        newErrors[field] = `${field} is required`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return { values, onChange, resetFields, validate, errors }
}
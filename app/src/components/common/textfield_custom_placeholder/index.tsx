import React from 'react'
import styled from 'styled-components'
import { rgba } from 'polished'

interface Props {
  disabled?: boolean
  formField: any
  placeholderText: any
}

const FieldWrapper = styled.div<{ disabled?: boolean }>`
  border-bottom-color: ${props => (props.disabled ? 'rgba(153, 153, 153, 0.5)' : '#999')};
  border-bottom-style: solid;
  border-bottom-width: 1px;
  display: flex;
  outline: none;
  padding: 6px 4px;
  width: 100%;

  > input {
    border: none;
    color: #000;
    flex-grow: 1;
    font-size: 13px;
    font-weight: normal;
    margin: 0 5px 0 0;
    padding: 0;

    &::placeholder {
      color: #999;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
`

FieldWrapper.defaultProps = {
  disabled: false,
}

const Placeholder = styled.span`
  color: #999;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: normal;
  line-height: 1.4;
  text-align: right;
`

export const TextfieldCustomPlaceholder = (props: Props) => {
  const { disabled, formField, placeholderText, ...restProps } = props

  return (
    <FieldWrapper disabled={disabled} {...restProps}>
      {formField}
      <Placeholder>{placeholderText}</Placeholder>
    </FieldWrapper>
  )
}

import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { ProductContext } from 'vtex.product-context'
import { FormattedCurrency } from 'vtex.format-currency'
import { useCssHandles } from 'vtex.css-handles'
import { IOMessageWithMarkers } from 'vtex.native-types'

import { StorefrontFC, PriceRangeProps } from './types'

const CSS_HANDLES = [
  'listPriceRange',
  'listPriceRangeMinValue',
  'listPriceRangeMinWithTax',
  'listPriceRangeMaxValue',
  'listPriceRangeMaxWithTax',
  'listPriceRangeUniqueValue',
  'listPriceRangeUniqueWithTax',
] as const

const ListPriceRange: StorefrontFC<PriceRangeProps> = props => {
  const { message, noRangeMessage, markers } = props
  const handles = useCssHandles(CSS_HANDLES)
  const { product, selectedItem } = useContext(ProductContext)

  const priceRange = product?.priceRange
  if (!priceRange) {
    return null
  }

  if (
    priceRange.listPrice.lowPrice === priceRange.sellingPrice.lowPrice &&
    priceRange.listPrice.highPrice === priceRange.sellingPrice.highPrice
  ) {
    return null
  }

  const commercialOffer = selectedItem?.sellers[0]?.commertialOffer
  if (!commercialOffer) {
    return null
  }

  const minPrice: number = priceRange.listPrice.lowPrice
  const maxPrice: number = priceRange.listPrice.highPrice
  const hasRange = minPrice !== maxPrice
  const minPriceWithTax = minPrice + minPrice * commercialOffer.taxPercentage
  const maxPriceWithTax = maxPrice + maxPrice * commercialOffer.taxPercentage

  if (hasRange) {
    return (
      <span className={handles.listPriceRange}>
        <IOMessageWithMarkers
          message={message}
          markers={markers}
          handleBase="listPriceRange"
          values={{
            minPriceValue: (
              <span
                key="minPriceValue"
                className={`${handles.listPriceRangeMinValue} strike`}
              >
                <FormattedCurrency value={minPrice} />
              </span>
            ),
            maxPriceValue: (
              <span
                key="maxPriceValue"
                className={`${handles.listPriceRangeMaxValue} strike`}
              >
                <FormattedCurrency value={maxPrice} />
              </span>
            ),
            minPriceWithTax: (
              <span
                key="minPriceWithTax"
                className={`${handles.listPriceRangeMinWithTax} strike`}
              >
                <FormattedCurrency value={minPriceWithTax} />
              </span>
            ),
            maxPriceWithTax: (
              <span
                key="maxPriceWithTax"
                className={`${handles.listPriceRangeMaxWithTax} strike`}
              >
                <FormattedCurrency value={maxPriceWithTax} />
              </span>
            ),
          }}
        />
      </span>
    )
  }

  return (
    <span className={handles.listPriceRange}>
      <IOMessageWithMarkers
        message={noRangeMessage}
        markers={markers}
        handleBase="listPriceRange"
        values={{
          listPriceValue: (
            <span
              key="listPriceValue"
              className={`${handles.listPriceRangeUniqueValue} strike`}
            >
              <FormattedCurrency value={maxPrice} />
            </span>
          ),
          listPriceWithTax: (
            <span
              key="listPriceWithTax"
              className={`${handles.listPriceRangeUniqueWithTax} strike`}
            >
              <FormattedCurrency value={maxPriceWithTax} />
            </span>
          ),
        }}
      />
    </span>
  )
}

const messages = defineMessages({
  title: {
    id: 'admin/list-price-range.title',
  },
  messageTitle: {
    id: 'admin/list-price-range-message.title',
  },
  messageDescription: {
    id: 'admin/list-price-range-message.description',
  },
  messageDefault: {
    id: 'store/list-price-range-message.default',
  },
  noRangeMessageTitle: {
    id: 'admin/list-price-range-no-range-message.title',
  },
  noRangeMessageDescription: {
    id: 'admin/list-price-range-no-range-message.description',
  },
  noRangeMessageDefault: {
    id: 'store/list-price-range-no-range-message.default',
  },
})

ListPriceRange.schema = {
  title: messages.title.id,
  type: 'object',
  properties: {
    message: {
      title: messages.messageTitle.id,
      description: messages.messageDescription.id,
    },
    noRangeMessage: {
      title: messages.noRangeMessageTitle.id,
      description: messages.noRangeMessageDescription.id,
    },
  },
}

export default ListPriceRange

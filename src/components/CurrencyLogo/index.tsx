import { Currency } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import React, { useMemo } from 'react'
import styled from 'styled-components/macro'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import Logo from '../Logo'

type Network = 'ethereum' | 'arbitrum' | 'optimism'

export const getTokenLogoURL = (
  symbol: string,
  chainId: SupportedChainId = SupportedChainId.MAINNET
): string | void => {
  const networksWithUrls = [SupportedChainId.MAINNET]
  if (networksWithUrls.includes(chainId)) {
    return `https://tokens-assets.prod.p00ls.io/${symbol}/token.png`
  }
}

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  ...rest
}: {
  currency?: Currency | null
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (!currency || currency.isNative) return []

    if (currency.isToken) {
      const defaultUrls = []
      const url = currency.symbol ? getTokenLogoURL(currency.symbol, currency.chainId) : undefined
      if (url) {
        defaultUrls.push(url)
      }
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls]
      }
      return defaultUrls
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative) {
    return <StyledEthereumLogo src={EthereumLogo} alt="ethereum logo" size={size} style={style} {...rest} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} {...rest} />
}

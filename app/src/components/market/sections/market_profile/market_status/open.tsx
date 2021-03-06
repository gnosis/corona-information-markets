import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { SHOW_ANSWER_IN_REALITIO, SHOW_POOLING_BTN } from '../../../../../common/constants'
import { WhenConnected } from '../../../../../hooks/connectedWeb3'
import { BalanceItem, MarketMakerData, OutcomeTableValue } from '../../../../../util/types'
import { Button, ButtonContainer } from '../../../../button'
import { ButtonType } from '../../../../button/button_styling_types'
import { MarketTopDetailsOpen } from '../../../common/market_top_details_open'
import { OutcomeTable } from '../../../common/outcome_table'
import { ViewCard } from '../../../common/view_card'

const LeftButton = styled(Button)`
  margin-right: auto;
`

const MessageWrapper = styled.div`
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borders.borderColorLighter};
  margin-top: 20px;
  padding: 20px 25px;
`

const Title = styled.h2`
  color: ${props => props.theme.colors.textColorDarker};
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.2px;
  line-height: 1.2;
  margin: 0 0 8px;
`

const Text = styled.p`
  color: ${props => props.theme.colors.textColor};
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.2px;
  line-height: 1.5;
  margin: 0;
`

interface Props extends RouteComponentProps<{}> {
  account: Maybe<string>
  marketMakerData: MarketMakerData
}

const Wrapper = (props: Props) => {
  const { history, marketMakerData } = props

  const { address: marketMakerAddress, balances, collateral, question, totalPoolShares } = marketMakerData

  const isQuestionOpen = question.resolution.valueOf() < Date.now()

  const userHasShares = balances.some((balanceItem: BalanceItem) => {
    const { shares } = balanceItem
    return !shares.isZero()
  })

  const probabilities = balances.map(balance => balance.probability)
  const hasFunding = totalPoolShares.gt(0)

  const renderTableData = () => {
    const disabledColumns = [OutcomeTableValue.Payout, OutcomeTableValue.Outcome, OutcomeTableValue.Probability]

    if (!userHasShares) {
      disabledColumns.push(OutcomeTableValue.Shares)
    }

    return (
      <OutcomeTable
        balances={balances}
        collateral={collateral}
        disabledColumns={disabledColumns}
        displayRadioSelection={false}
        probabilities={probabilities}
      />
    )
  }

  const poolButton = (
    <LeftButton
      buttonType={ButtonType.secondaryLine}
      onClick={() => {
        history.push(`${marketMakerAddress}/pool-liquidity`)
      }}
    >
      Pool Liquidity
    </LeftButton>
  )

  const openQuestionMessage = (
    <MessageWrapper>
      <Title>The question is being resolved.</Title>
      <Text>This can take up to 24h. You will be able to redeem your winnings as soon as the market is resolved.</Text>
    </MessageWrapper>
  )

  const openInRealitioButton = (
    <Button
      buttonType={ButtonType.secondaryLine}
      onClick={() => {
        window.open(`https://realitio.github.io/#!/question/${question.id}`)
      }}
    >
      Answer in Realit.io
    </Button>
  )

  const buySellButtons = (
    <>
      <Button
        buttonType={ButtonType.secondaryLine}
        disabled={!userHasShares || !hasFunding}
        onClick={() => {
          history.push(`${marketMakerAddress}/sell`)
        }}
      >
        Sell
      </Button>
      <Button
        buttonType={ButtonType.secondaryLine}
        disabled={!hasFunding}
        onClick={() => {
          history.push(`${marketMakerAddress}/buy`)
        }}
      >
        Buy
      </Button>
    </>
  )

  return (
    <ViewCard>
      <MarketTopDetailsOpen marketMakerData={marketMakerData} toggleTitle="Pool Information" />
      {renderTableData()}
      {isQuestionOpen && SHOW_ANSWER_IN_REALITIO && openQuestionMessage}
      <WhenConnected>
        <ButtonContainer>
          {SHOW_POOLING_BTN && poolButton}
          {isQuestionOpen ? (SHOW_ANSWER_IN_REALITIO ? null : openInRealitioButton) : buySellButtons}
        </ButtonContainer>
      </WhenConnected>
    </ViewCard>
  )
}

export const OpenMarketDetails = withRouter(Wrapper)

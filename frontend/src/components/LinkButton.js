import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
    background-color: white;
    padding: 8px 16px;
    border: 1px lightgrey solid;
    border-radius: 5px;

    &:visited  {
        color: black;
    }

    &:hover {
        background-color: rgba(225, 228, 232, 0.5);
    }
`;

const ContentWrapper = styled.div`
    display: inline-flex;
    align-items: center;
`;

const IconWrapper = styled.div`
    display: box;
    margin-right: 5px;
`;

const Counter = styled.div`
    background-color: rgba(209, 213, 218, 0.5);
    border: 1px solid transparent;
    margin: 0px 5px;
    padding: 0px 6px;
    border-radius: 50%;
`;

const LinkButton = ({
  text, path, Icon, count,
}) => (
  <StyledLink to={path}>
    <ContentWrapper>
      <IconWrapper>
        <Icon/>
      </IconWrapper>
      {text}
      { count && (
        <Counter>
            {count}
        </Counter>
      )}
    </ContentWrapper>
  </StyledLink>
);

export default LinkButton;

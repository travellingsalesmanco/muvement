import React from 'react';
import MediaQuery from 'react-responsive';

const breakpoints = {
  desktop: '(min-width: 1025px)',
  tabletLandscape: '(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)',
  tabletPortrait: '(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)',
  phoneLandscape: '(min-width: 481px) and (max-width: 767px)',
  phonePortrait: '(min-width: 320px) and (max-width: 480px)'
};

export function Breakpoint(props) {
  const breakpoint = breakpoints[props.name] || breakpoints.desktop;
  return (
    <MediaQuery {...props } query={breakpoint}>
      {props.children}
    </MediaQuery>
  );
}

export function Desktop(props) {
  return (
    <Breakpoint name='desktop'>
      {props.children}
    </Breakpoint>
  );
}

export function TabletLandscape(props) {
  return (
    <Breakpoint name='tabletLandscape'>
      {props.children}
    </Breakpoint>
  );
}

export function TabletPortrait(props) {
  return (
    <Breakpoint name='tabletPortrait'>
      {props.children}
    </Breakpoint>
  );
}

export function PhoneLandscape(props) {
  return (
    <Breakpoint name='phoneLandscape'>
      {props.children}
    </Breakpoint>
  );
}

export function PhonePortrait(props) {
  return (
    <Breakpoint name='phonePortrait'>
      {props.children}
    </Breakpoint>
  );
}
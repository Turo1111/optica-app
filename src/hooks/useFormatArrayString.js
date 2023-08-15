import React from 'react';

function useFormatArrayString(array) {
  function formatArrayToString(array) {
    if (!array) {
      return '';
    }
    if (array.length === 0) {
      return '';
    } else if (array.length === 1) {
      return array[0] + '.';
    } else if (array.length === 2) {
      return array[0] + ' y ' + array[1] + '.';
    } else {
      const lastElement = array.pop();
      const joinedElements = array.join(', ');
      return joinedElements + ' y ' + lastElement + '.';
    }
  }

  return formatArrayToString(array);
}

export default useFormatArrayString;
import React from 'react';

export function stringMultiLine(string) {
  const array = string.split('\n');
  if (array.length === 1) {
    return array[0];
  }

  return array.map((e, i) => {
    return (
      <div key={i} style={{display: 'block'}}>
        {e}
      </div>
    );
  });
}
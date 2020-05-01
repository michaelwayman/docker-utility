import React from 'react';

const Tab = (props) => {
  function buildTableRows() {
    return props.envData.map((e, i) => {
      const v = e.split('=');
      return (
        <tr key={i}>
          <td className='title'>{v[0]}</td>
          <td>{v[1]}</td>
        </tr>
      );
    });
  }

  return (
    <table>
      <tbody>
      {buildTableRows()}
      </tbody>
    </table>
  );
};

export const ImageEnvTab = (props) => {
  return (
    <Tab envData={props.imageDetails.Config.Env}/>
  );
};

export const ContainerEnvTab = (props) => {
  return (
    <Tab envData={props.containerDetails.Config.Env}/>
  );
};

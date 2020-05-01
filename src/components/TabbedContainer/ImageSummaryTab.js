import React from 'react';


function multiLine(array) {
  if (array) {
    return array.map((e, i) => {
      return <div key={i}>{e}</div>;
    }).sort();
  } else {
    return '';
  }
}

export default (props) => {
  function getDataFromProps() {
    if (!props.imageDetails.Id) {
      return {};
    }

    const {Config, RepoTags} = props.imageDetails;
    const command = (Config.Cmd || []).join(' ');
    const workingDir = Config.WorkingDir || '/';
    const repoTags = RepoTags;

    const exposedPorts = [];
    for (let key in Config.ExposedPorts) {
      if (Config.ExposedPorts.hasOwnProperty(key)) {
        exposedPorts.push(`${key}`);
      }
    }
    exposedPorts.sort();
    return {
      command, workingDir, exposedPorts, repoTags,
    };
  }

  const data = getDataFromProps();
  return (
    <table>
      <tbody>
      <tr>
        <td className='title'>tags</td>
        <td>{multiLine(data.repoTags)}</td>
      </tr>
      <tr>
        <td className='title'>id</td>
        <td>{props.image}</td>
      </tr>
      <tr>
        <td className='title'>working dir</td>
        <td>{data.workingDir}</td>
      </tr>
      <tr>
        <td className='title'>command</td>
        <td>{data.command}</td>
      </tr>
      <tr>
        <td className='title'>exposed ports</td>
        <td>{multiLine(data.exposedPorts)}</td>
      </tr>
      </tbody>
    </table>
  );
};

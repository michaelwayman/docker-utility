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
    if (!props.containerDetails.Id) {
      return {};
    }

    const {Config, Mounts, State, NetworkSettings, Name} = props.containerDetails;
    const name = Name.slice(1, Name.length);
    const hostname = Config.Hostname;
    const command = Config.Cmd.join(' ');
    const imageName = Config.Image;
    const workingDir = Config.WorkingDir || '/';
    const status = State.Status;
    const mounts = Mounts.map((e) => {
      let mode = e.RW ? ':rw' : '';
      return `${e.Source}:${e.Destination}${mode}`;
    }).sort();
    const ports = [];
    for (let key in NetworkSettings.Ports) {
      if (NetworkSettings.Ports.hasOwnProperty(key) && NetworkSettings.Ports[key]) {
        NetworkSettings.Ports[key].forEach(e => {
          if (e.hasOwnProperty('HostIp') && e.hasOwnProperty('HostPort')) {
            ports.push(`${e['HostIp']}:${e['HostPort']}->${key}`);
          }
        });
      }
    }
    ports.sort();
    return {
      name, hostname, command, imageName, workingDir, status, mounts, ports
    };
  }

  const data = getDataFromProps();
  return (
    <table>
      <tbody>
      <tr>
        <td className='title'>name</td>
        <td>{data.name}</td>
      </tr>
      <tr>
        <td className='title'>full id</td>
        <td>{props.container}</td>
      </tr>
      <tr>
        <td className='title'>hostname</td>
        <td>{data.hostname}</td>
      </tr>
      <tr>
        <td className='title'>status</td>
        <td>{data.status}</td>
      </tr>
      <tr>
        <td className='title'>command</td>
        <td>{data.command}</td>
      </tr>
      <tr>
        <td className='title'>image</td>
        <td>{data.imageName}</td>
      </tr>
      <tr>
        <td className='title'>working dir</td>
        <td>{data.workingDir}</td>
      </tr>
      <tr>
        <td className='title'>published ports</td>
        <td>{multiLine(data.ports)}</td>
      </tr>
      <tr>
        <td className='title'>mounts</td>
        <td>{multiLine(data.mounts)}</td>
      </tr>
      </tbody>
    </table>
  );
};

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { convertBytes } from 'utils/convert';
import { fileDownload } from 'requests/file/file';

export default class File extends React.Component {
    handleFileDownLoad(param) {
        function saveAs(uri, filename) {
            let link = document.createElement('a');
            if (typeof link.download === 'string') {
                document.body.appendChild(link); // Firefox requires the link to be in the body
                link.download = filename;
                link.href = uri;
                link.click();
                document.body.removeChild(link); // remove the link when done
            } else {
                location.replace(uri);
            }
        }
        fileDownload(param)().then(res => {
            let { url } = res;
            saveAs(url, 'ahahaa.js');
        });
    }
    file({value, schema, data, objName}) {
        if (!data || !schema || !objName) {
            return <div />;
        }
        let { filename, size, url } = value;
        let fieldName = schema.name;
        let { version, id } = data;
        if (filename && url ) {
            return (
                <div className="mcds-media" >
                    <div className="mcds-media__figure">
                        <span className="mcds-icon mcds-icon__size-16">
                            <span className="mcds-icon__paperclip-solid-24" />
                        </span>
                    </div>
                    <div className="mcds-media__body mcds-layout__column">
                        <div className="mcds-layout__item mcds-truncate" style={{width: 0}}>
                            <Link
                                onClick={
                                    this.handleFileDownLoad.bind(this,
                                        {
                                            file_id: url,
                                            object_name: objName,
                                            field_name: fieldName,
                                            record_id: id,
                                            version: version
                                        })
                                }
                                target="_blank">
                                {filename}
                            </Link>
                        </div>
                        <div>
                            {convertBytes(size)}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    render() {
        return this.file(this.props);
    }
}

File.propTypes = {
    value: PropTypes.any.isRequired,
    className: PropTypes.string
};


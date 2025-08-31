import React, { Component } from 'react';
import Joyride from 'react-joyride';

class Tutorial extends Component {
    handleJoyrideCallback = (data) => {
        const { status } = data;
        if (['finished', 'skipped'].includes(status)) {
            if (this.props.onFinish) {
                this.props.onFinish();
            }
            document.getElementById('content').style.overflow = 'auto';
        }
    };

    componentDidMount() {
        document.getElementById('content').style.overflow = 'auto';
    }

    componentDidUpdate(prev) {
        if (prev.data != this.props.data) document.getElementById('content').style.overflow = 'auto';
    }

    componentWillUnmount() {
        document.getElementById('content').style.overflow = 'auto';
    }

    render() {
        const { data, run = true } = this.props;
        const Color = window.sessionStorage.getItem("color") || "#000a69";
        return (
            <Joyride
                steps={data}
                run={run}
                continuous
                scrollToFirstStep
                showSkipButton
                showProgress
                callback={this.handleJoyrideCallback}
                locale={{
                    back: 'Kembali',
                    close: 'Tutup',
                    last: 'Selesai',
                    next: 'Berikutnya',
                    skip: 'Lewati'
                }}
                styles={{
                    options: {
                        primaryColor: Color,
                        zIndex: 10000
                    }
                }}
            />
        );
    }
}

export default Tutorial;

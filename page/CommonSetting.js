/* eslint-disable react/prop-types */
'use strict'

import { strings, Styles } from 'miot/resources'
import { CommonSetting } from 'miot/ui/CommonSetting'
import { firstAllOptions } from 'miot/ui/CommonSetting/CommonSetting'
import Separator from 'miot/ui/Separator'
import { TitleBarBlack } from 'miot/ui'
import { Device, PackageEvent, Service } from 'miot'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import i18n from '../i18n'

export default class Setting extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: <TitleBarBlack title={strings.setting} style={[{ backgroundColor: '#fff' }]}
        onPressLeft={() => {
          navigation.goBack()
        }}/>
    }
  };

  constructor (props, context) {
    super(props, context)
    this.state = {
      showDot: []
    }
  }

  render () {
    const firstOptions = [
      firstAllOptions.SHARE,
      firstAllOptions.FIRMWARE_UPGRADE
    ]

    // 显示固件升级二级菜单
    const extraOptions = {
      showUpgrade: true,
      deleteDeviceMessage: '',
      option: {
        privacyURL: i18n.privacy,
        agreementURL: i18n.agreement,
        experiencePlanURL: '',
        hideUserExperiencePlan: true
      }
    }
    return (
      <View style={styles.container}>
        <Separator />
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={[styles.blank, { borderTopWidth: 0 }]} />
          <CommonSetting
            navigation={this.props.navigation}
            firstOptions={firstOptions}
            showDot={this.state.showDot}
            extraOptions={extraOptions}
          />
          <View style={[{ height: 20 }]} />
        </ScrollView>
      </View>
    )
  }

  componentDidMount () {
    this.checkDeviceVersion()
    // 升级界面返回来, 再去检查下固件升级 来去掉小红点
    this.nativeBack = PackageEvent.packageViewWillAppear.addListener(() => {
      this.checkDeviceVersion()
    })
  }

  componentWillUnmount () {
    this.nativeBack && this.nativeBack.remove()
  }

  checkDeviceVersion () {
    Service.smarthome.checkDeviceVersion(Device.deviceID, Device.type)
      .then(res => {
        const showDot = res.hasNewFirmware ? [firstAllOptions.FIRMWARE_UPGRADE] : []
        this.setState({
          showDot
        })
      }).catch(e => {
        console.log(e)
      })
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: Styles.common.backgroundColor,
    flex: 1
  },
  blank: {
    height: 8,
    backgroundColor: Styles.common.backgroundColor,
    borderTopColor: Styles.common.hairlineColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Styles.common.hairlineColor,
    borderBottomWidth: StyleSheet.hairlineWidth
  }
})

<template>
  <div>
    <v-dialog v-model="showDialog" max-width="400">
      <v-card>
        <v-card-title v-show="!success">Send a stream invite</v-card-title>
        <v-alert v-model="showError" dismissible type="error" :class="`${success ? 'mb-0' : ''}`">
          {{ error }}
        </v-alert>
        <v-alert v-model="success" dismissible type="success">
          Great! An invite link has been sent.
          <br />
          Send another one?
        </v-alert>
        <v-form
          v-show="!success"
          ref="form"
          v-model="valid"
          class="px-2"
          @submit.prevent="sendInvite"
        >
          <v-card-text class="pb-0 mb-0">
            We will send an invite link for this server to the email below and once your guest will
            accept the invite, <b>they will be granted access to this stream</b>. You can also add a
            personal message if you want to.
          </v-card-text>
          <v-card-text class="pt-0 mt-0">
            <v-text-field
              v-model="email"
              :rules="validation.emailRules"
              label="email"
            ></v-text-field>
            <v-text-field v-model="message" label="message"></v-text-field>
            <v-card-actions>
              <v-btn block color="primary" type="submit">Send invite</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'ServerInviteDialog',
  props: {
    show: {
      type: Number,
      default: 0
    },
    streamId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      showDialog: false,
      email: null,
      message: 'Hey, I want to share this stream with you!',
      valid: false,
      error: null,
      showError: false,
      success: false,
      validation: {
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ]
      }
    }
  },
  watch: {
    show() {
      this.showDialog = true
    },
    showDialog() {
      this.clear()
    }
  },
  methods: {
    clear() {
      this.error = null
      this.showError = false
      this.email = null
      this.success = false
      this.message = 'Hey, I want to share this stream with you!'
    },
    async sendInvite() {
      if (!this.$refs.form.validate()) return

      this.$matomo && this.$matomo.trackPageView('invite/stream/create')
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation($input: StreamInviteCreateInput!) {
              streamInviteCreate(input: $input)
            }
          `,
          variables: {
            input: {
              email: this.email,
              message: this.message,
              streamId: this.streamId
            }
          }
        })

        this.clear()
        this.success = true
      } catch (e) {
        this.clear()
        this.showError = true
        this.error = e.message
      }
    }
  }
}
</script>